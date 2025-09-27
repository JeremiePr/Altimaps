const constants =
{
    valueUrlPattern: '/maps/photometa/v1',
    cancelUrlPattern: '2sspotlight!',
    allowedUrls: [
        "https://www.google.com/maps/photometa/v1*",
        "https://www.google.fr/maps/photometa/v1*",
        "https://www.google.ch/maps/photometa/v1*",
        "https://www.google.com/maps/vt/*",
        "https://www.google.fr/maps/vt/*",
        "https://www.google.ch/maps/vt/*"
    ]
};

const variables =
{
    url: '',
    locked: false,
    isReady: false
};

async function getCurrentTab()
{
    return await new Promise(resolve =>
    {
        browser.tabs.query({ active: true, lastFocusedWindow: true }, tabs => resolve(tabs[0]));
    });
}

async function getAndApplyAltitude(url)
{
    variables.locked = true;
    setTimeout(() => variables.locked = false, 200);
    variables.url = url;

    const response = await fetch(url);
    const data = await response.text();
    const json = JSON.parse(data.substring(4));
    const altitude = parseInt(json[1][0][5][0][1][1][0]);

    await sendContentMessage('StreetView', altitude);
}

async function sendContentMessage(mode, value)
{
    if (!variables.isReady) return;
    const tab = await getCurrentTab();
    browser.tabs.sendMessage(tab.id, { mode, value });
}

browser.webRequest.onBeforeRequest.addListener(req =>
{
    if (req.url.includes(constants.valueUrlPattern))
    {
        if (!variables.locked && variables.url !== req.url) getAndApplyAltitude(req.url);
    }
    else
    {
        sendContentMessage('Maps', null);
    }
}, { urls: constants.allowedUrls });

browser.runtime.onMessage.addListener(message =>
{
    switch (message.mode)
    {
        case 'ContentReady':
            variables.isReady = true;
            break;
    }
});