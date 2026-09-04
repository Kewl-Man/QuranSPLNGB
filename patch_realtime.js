let presenceChannel = null;
let onlineUsers = {}; // uid -> user profile data
let typingUsers = {}; // uid -> { timestamp, name, channel }

function initRealtimePresence() {
    if (!currentUser || !supabaseClient) return;
    
    if (presenceChannel) {
        supabaseClient.removeChannel(presenceChannel);
    }
    
    presenceChannel = supabaseClient.channel('global_presence', {
        config: {
            presence: {
                key: currentUser.id,
            },
        },
    });

    presenceChannel
        .on('presence', { event: 'sync' }, () => {
            const newState = presenceChannel.presenceState();
            onlineUsers = {};
            for (const key in newState) {
                if (newState[key].length > 0) {
                    onlineUsers[key] = newState[key][0];
                }
            }
            renderOnlineUsersBadge();
            renderDmUsersList();
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
            onlineUsers[key] = newPresences[0];
            renderOnlineUsersBadge();
            renderDmUsersList();
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
            delete onlineUsers[key];
            renderOnlineUsersBadge();
            renderDmUsersList();
        })
        .on('broadcast', { event: 'typing' }, ({ payload }) => {
            if (payload.userId !== currentUser.id) {
                typingUsers[payload.userId] = {
                    timestamp: Date.now(),
                    name: payload.name,
                    channel: payload.channel // 'global' or dm 'userId'
                };
                renderTypingIndicators();
            }
        })
        .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                const pForPresence = currentUserProfile || {};
                await presenceChannel.track({
                    id: currentUser.id,
                    email: currentUser.email,
                    display_name: pForPresence.display_name || pForPresence.displayName || currentUser.email.split('@')[0],
                    photo_url: pForPresence.photo_url || pForPresence.photoURL || '',
                    avatar_gradient: pForPresence.avatar_gradient || pForPresence.avatarGradient || 'emerald',
                    is_admin: pForPresence.is_admin || false
                });
            }
        });
        
    setInterval(() => {
        const now = Date.now();
        let changed = false;
        for (const uid in typingUsers) {
            if (now - typingUsers[uid].timestamp > 3000) {
                delete typingUsers[uid];
                changed = true;
            }
        }
        if (changed) renderTypingIndicators();
    }, 1000);
}

function broadcastTyping(channelContext) {
    if (!presenceChannel || !currentUser) return;
    const p = currentUserProfile || {};
    presenceChannel.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
            userId: currentUser.id,
            name: p.display_name || p.displayName || currentUser.email.split('@')[0],
            channel: channelContext
        }
    }).catch(err => console.error(err));
}

function renderTypingIndicators() {
    const globalInd = document.getElementById('global-typing-indicator');
    const dmInd = document.getElementById('dm-typing-indicator');
    
    let globalTypers = [];
    let dmTypers = [];
    
    for (const uid in typingUsers) {
        const t = typingUsers[uid];
        if (t.channel === 'global') globalTypers.push(t.name);
        // if they are typing in DM to ME
        if (t.channel === currentUser.id && activeDmRecipient && (activeDmRecipient.id === uid || activeDmRecipient.userId === uid)) {
            dmTypers.push(t.name);
        }
    }
    
    if (globalInd) {
        if (globalTypers.length > 0) {
            globalInd.innerHTML = `<span class="typing-anim">💬</span> ${escapeHtml(globalTypers.join(', '))} ${globalTypers.length > 1 ? 'are' : 'is'} typing...`;
        } else {
            globalInd.innerHTML = '';
        }
    }
    
    if (dmInd) {
        if (dmTypers.length > 0) {
            dmInd.style.display = 'flex';
            dmInd.innerHTML = `<span class="typing-anim">💬</span> ${escapeHtml(dmTypers.join(', '))} ${dmTypers.length > 1 ? 'are' : 'is'} typing...`;
        } else {
            dmInd.style.display = 'none';
            dmInd.innerHTML = '';
        }
    }
}

function renderOnlineUsersBadge() {
    const badge = document.getElementById('online-users-badge');
    const dropdown = document.getElementById('online-users-dropdown');
    if (!badge || !dropdown) return;
    
    const count = Object.keys(onlineUsers).length;
    badge.innerHTML = `🟢 ${count} Online`;
    
    let html = '';
    for (const uid in onlineUsers) {
        const u = onlineUsers[uid];
        const isMe = currentUser && uid === currentUser.id;
        const nameStr = escapeHtml(u.display_name || u.email || 'Member') + (isMe ? ' (You)' : '');
        html += `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 24px; height: 24px; border-radius: 50%; overflow: hidden; background: transparent; flex-shrink: 0;">
                    <img src="${escapeHtml(u.photo_url || DEFAULT_AVATAR)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='${DEFAULT_AVATAR}'">
                </div>
                <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">
                    ${nameStr}
                </div>
                <div style="font-size: 0.6rem; color: var(--accent);">🟢</div>
            </div>
        `;
    }
    dropdown.innerHTML = html;
}

function cleanupRealtimePresence() {
    if (presenceChannel && supabaseClient) {
        supabaseClient.removeChannel(presenceChannel);
        presenceChannel = null;
    }
    onlineUsers = {};
    typingUsers = {};
    renderOnlineUsersBadge();
    renderTypingIndicators();
}
