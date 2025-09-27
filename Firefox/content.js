function setAltitude(altitude)
{
    let textElement = document.getElementById('altitude-element-text');

    if (!textElement)
    {
        const containerElement = document.createElement('div');
        containerElement.id = 'altitude-element';
        containerElement.style.position = 'fixed';
        containerElement.style.bottom = '20px';
        containerElement.style.left = '262px';
        containerElement.style.height = '30px';
        containerElement.style.width = '80px';
        containerElement.style.display = 'flex';
        containerElement.style.justifyContent = 'center';
        containerElement.style.alignItems = 'center';
        containerElement.style.backgroundColor = '#f1f3f4';
        containerElement.style.borderRadius = '6px';
        containerElement.style.border = '2px solid #000000';
        document.body.appendChild(containerElement);

        textElement = document.createElement('p');
        textElement.id = 'altitude-element-text';
        containerElement.appendChild(textElement);
    }

    textElement.innerHTML = `${altitude}m`;
}

function removeAltitude()
{
    const containerElement = document.getElementById('altitude-element');
    if (containerElement) containerElement.remove();
}

browser.runtime.onMessage.addListener((message, _, sendResponse) =>
{
    switch (message.mode)
    {
        case 'StreetView':
            setAltitude(message.value);
            break;
        case 'Maps':
            removeAltitude();
            break;
    }

    sendResponse();
});

browser.runtime.sendMessage(null, { mode: 'ContentReady' }, null);