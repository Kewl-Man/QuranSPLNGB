const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Inject patch_realtime.js at the bottom
const patch = fs.readFileSync('patch_realtime.js', 'utf8');
const avatarStr = "`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzk0YTNiOCI+PHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPjwvc3ZnPg==`";
const fixedPatch = patch.replace(/DEFAULT_AVATAR/g, avatarStr);

html = html.replace(/<\/body>/i, `    <script>\n${fixedPatch}\n    </script>\n</body>`);

// 2. Add hooks in auth state changed
html = html.replace(/updateUserHeaderUI\(user, currentUserProfile\);/g, "updateUserHeaderUI(user, currentUserProfile);\n                    if (typeof initRealtimePresence === 'function') initRealtimePresence();");
html = html.replace(/currentUserProfile = null;/g, "currentUserProfile = null;\n                if (typeof cleanupRealtimePresence === 'function') cleanupRealtimePresence();");

// 3. Add oninput to community-chat-input
html = html.replace(/id="community-chat-input"/g, 'id="community-chat-input" oninput="broadcastTyping(\'global\')"');

// 4. Add oninput to dm-chat-input
html = html.replace(/id="dm-chat-input"/g, 'id="dm-chat-input" oninput="if(activeDmRecipient) broadcastTyping(activeDmRecipient.id || activeDmRecipient.userId)"');

fs.writeFileSync('index.html', html);
console.log('Fixed index.html perfectly');
