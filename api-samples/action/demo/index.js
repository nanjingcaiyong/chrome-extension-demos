async function getCurrentPopup() {
  const popup = await chrome.action.getPopup({});
  document.getElementById('current-popup-value').value = popup;
  return popup;
}

// 回显徽标文案
async function showBadgeText() {
  const text = await chrome.action.getBadgeText({});
  document.getElementById('current-badge-text').value = text;
}

// 回显徽标颜色
async function showBadgeColor() {
  const color = await chrome.action.getBadgeBackgroundColor({});
  document.getElementById('current-badge-bg-color').value = JSON.stringify(
    color,
    null,
    0
  );
}

// 回显徽标字体颜色
async function showBadgeTextColor() {
  const color = await chrome.action.getBadgeTextColor({});
  document.getElementById('current-badge-txt-color').value = JSON.stringify(
    color,
    null,
    0
  );
}

// 回显悬停标题
async function showActionTitle() {
  let title = await chrome.action.getTitle({});

  // If empty, the title falls back to the name of the extension
  if (title === '') {
    // … which we can get from the extension's manifest
    const manifest = chrome.runtime.getManifest();
    title = manifest.name;
  }

  document.getElementById('current-title').value = title;
}

function debounce(timeout, callback) {
  let timeoutID = 0;
  return (event) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => callback(event), timeout);
  };
}

// 监听扩展图标点击事件, 当default_popup的值为空时触发
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'https://nanjingcaiyong.github.io/' });
});

// 启用/禁用插件
document
  .getElementById('toggle-state-button')
  .addEventListener('click', async (e) => {
    // 使用 isEnabled 方法读取扩展的当前状态
    let actionEnabled = await chrome.action.isEnabled();
    // 按钮点击时候切换状态
    if (actionEnabled) {
      chrome.action.disable();
      e.target.innerText = '开启扩展'
    } else {
      chrome.action.enable();
      e.target.innerText = '关闭扩展'
    }
  });

// 更改popup页面
document
  .getElementById('popup-options')
  .addEventListener('change', async (event) => {
    const popup = event.target.value;
    await chrome.action.setPopup({ popup });
    await getCurrentPopup();
  });

// 设置徽标内容
document
  .getElementById('badge-text-input')
  .addEventListener('input', async (event) => {
    const text = event.target.value;
    await chrome.action.setBadgeText({ text });

    showBadgeText();
  });


// 清除徽标内容
document
  .getElementById('clear-badge-button')
  .addEventListener('click', async () => {
    await chrome.action.setBadgeText({ text: '' });

    showBadgeText();
  });

// 随机徽标背景颜色
document
  .getElementById('set-badge-background-color-button')
  .addEventListener('click', async () => {
    // To show off this method, we must first make sure the badge has text
    let currentText = await chrome.action.getBadgeText({});
    if (!currentText) {
      chrome.action.setBadgeText({ text: 'hi :)' });
      showBadgeText();
    }

    // Next, generate a random RGBA color
    const color = [0, 0, 0].map(() => Math.floor(Math.random() * 255));

    // Use the default background color ~10% of the time.
    //
    // NOTE: Alpha color cannot be set due to crbug.com/1184905. At the time of writing (Chrome 89),
    // an alpha value of 0 sets the default color while a value of 1-255 will make the RGB color
    // fully opaque.
    if (Math.random() < 0.1) {
      color.push(0);
    } else {
      color.push(255);
    }

    chrome.action.setBadgeBackgroundColor({ color });
    showBadgeColor();
  });

// 重置徽标背景颜色
document
  .getElementById('reset-badge-background-color-button')
  .addEventListener('click', async () => {
    chrome.action.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
    showBadgeColor();
  });


// 随机徽标字体颜色
document
  .getElementById('set-badge-txt-color-button')
  .addEventListener('click', async () => {
    // To show off this method, we must first make sure the badge has text
    let currentText = await chrome.action.getBadgeText({});
    if (!currentText) {
      chrome.action.setBadgeText({ text: 'Test' });
      showBadgeText();
    }

    // Next, generate a random RGBA color
    const color = [0, 0, 0].map(() => Math.floor(Math.random() * 255));

    // Use the default background color ~10% of the time.
    //
    // NOTE: Alpha color cannot be set due to crbug.com/1184905. At the time of writing (Chrome 89),
    // an alpha value of 0 sets the default color while a value of 1-255 will make the RGB color
    // fully opaque.
    if (Math.random() < 0.1) {
      color.push(0);
    } else {
      color.push(255);
    }

    chrome.action.setBadgeTextColor({ color });
    showBadgeTextColor();
  });

// 重置徽标字体颜色
document
  .getElementById('reset-badge-txt-color-button')
  .addEventListener('click', async () => {
    chrome.action.setBadgeTextColor({ color: '#000000' });
    showBadgeTextColor();
  });


const EMOJI = ['confetti', 'suit', 'bow', 'dog', 'skull', 'yoyo', 'cat'];
let lastIconIndex = 0;
// 设置扩展操作按钮图片
document
  .getElementById('set-icon-button')
  .addEventListener('click', async () => {
    // Clear out the badge text in order to make the icon change easier to see
    chrome.action.setBadgeText({ text: '' });

    // Randomly pick a new icon
    let index = lastIconIndex;
    index = Math.floor(Math.random() * EMOJI.length);
    if (index === lastIconIndex) {
      // Dupe detected! Increment the index & modulo to make sure we don't go out of bounds
      index = (index + 1) % EMOJI.length;
    }
    const emojiFile = `images/emoji-${EMOJI[index]}.png`;
    lastIconIndex = index;

    // There are easier ways for a page to extract an image's imageData, but the approach used here
    // works in both extension pages and service workers.
    const response = await fetch(chrome.runtime.getURL(emojiFile));
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    const osc = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    let ctx = osc.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, osc.width, osc.height);

    chrome.action.setIcon({ imageData });
  });

// 重置扩展操作按钮图片
document.getElementById('reset-icon-button').addEventListener('click', () => {
  const manifest = chrome.runtime.getManifest();
  chrome.action.setIcon({ path: manifest.action.default_icon });
});

const titleInput = document.getElementById('title-input');
titleInput.addEventListener(
  'input',
  debounce(200, async (event) => {
    const title = event.target.value;
    chrome.action.setTitle({ title });

    showActionTitle();
  })
);

// 重置悬停标题
document
  .getElementById('reset-title-button')
  .addEventListener('click', async () => {
    const manifest = chrome.runtime.getManifest();
    let title = manifest.action.default_title;

    chrome.action.setTitle({ title });
    document.getElementById('title-input').value = title
    showActionTitle();
  });