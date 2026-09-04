const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add initRealtimePresence() to handleAuthStateChanged inside the try block if(profile) / else dbPayload
html = html.replace(/updateUserHeaderUI\(user, currentUserProfile\);/g, "updateUserHeaderUI(user, currentUserProfile);\n                    if (typeof initRealtimePresence === 'function') initRealtimePresence();");

// 2. Add cleanupRealtimePresence() to handleAuthStateChanged else block
html = html.replace(/currentUserProfile = null;/g, "currentUserProfile = null;\n                if (typeof cleanupRealtimePresence === 'function') cleanupRealtimePresence();");

// 3. Add oninput to community-chat-input
html = html.replace(/id="community-chat-input"/g, 'id="community-chat-input" oninput="broadcastTyping(\'global\')"');

// 4. Add oninput to dm-chat-input
html = html.replace(/id="dm-chat-input"/g, 'id="dm-chat-input" oninput="if(activeDmRecipient) broadcastTyping(activeDmRecipient.id || activeDmRecipient.userId)"');

fs.writeFileSync('index.html', html);
console.log('Fixed index.html via JS');
