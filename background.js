const constants =
{
    valueUrlPattern: '/maps/photometa/v1',
    valueMode: 'StreetView',
    cancelUrlPattern: '2sspotlight!',
    cancelMode: 'Maps',
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
    locked: false
};

const getCurrentTab = () => new Promise(resolve =>
{
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => resolve(tabs[0]));
});

async function getAndApplyAltitude(url)
{
    variables.locked = true;
    setTimeout(() => variables.locked = false, 200);
    variables.url = url;

    const response = await fetch(url);
    const data = await response.text();
    const json = JSON.parse(data.substring(4));
    const altitude = parseInt(json[1][0][5][0][1][1][0]);

    await sendContentMessage(constants.valueMode, altitude);
}

async function sendContentMessage(mode, value)
{
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, { mode, value });
}

chrome.webRequest.onBeforeRequest.addListener(req =>
{
    if (req.url.includes(constants.valueUrlPattern))
    {
        if (!variables.locked && variables.url !== req.url) getAndApplyAltitude(req.url);
    }
    else
    {
        sendContentMessage(constants.cancelMode, null);
    }
}, { urls: constants.allowedUrls });