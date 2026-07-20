const downloadBtn = document.querySelector('.button-accent');

fetch('https://api.github.com/repos/JereIDE/JereIDE/releases/latest')
    .then(res => res.json())
    .then(data => {
        const tag = data.tag_name;
        downloadBtn.textContent = `Download Version ${tag.replace(/^v/i, '')}`;
        downloadBtn.href = data.html_url;
    })
    .catch(() => {
        downloadBtn.textContent = 'Download Latest Release';
    });
