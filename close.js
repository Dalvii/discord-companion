const ipc = require('electron').ipcRenderer
const { remote } = require('electron')
const open = require('open');
const shell = require('electron').shell;

const input = document.querySelector('input');
input.addEventListener('change', updateValue);
function updateValue(e) {
    console.log(e.target.value)
    ipc.send('discord-msg-send', e.target.value)
    input.value = ''
}
ipc.on('discord-msg-send', (event, arg) => {
    document.getElementById('channelText').innerHTML = arg
    console.log(arg)
})

function typingIn() {
    ipc.send('typingIn')
}

let channel_query = '';


ipc.on('discord_new_messages', function (event, arg) {
    console.log(arg);
    let html = '';

    const reponse = arg.reverse()
    for (let i = 0; i < reponse.length; i++) {

        const day = new Date(reponse[i].time).getDate().toString().padStart(2, '0');
        const month = (new Date(reponse[i].time).getMonth() + 1).toString().padStart(2, '0');
        const year = new Date(reponse[i].time).getFullYear().toString().padStart(2, '0');
        const hours = new Date(reponse[i].time).getHours().toString().padStart(2, '0');
        const minutes = new Date(reponse[i].time).getMinutes().toString().padStart(2, '0');
        const dateNow = new Date().getDate();
        const date = dateNow == day ? `Aujourd'hui à ` + hours + ':' + minutes : day + '/' + month + '/' + year;
        //const message = reponse[i].content.toString().match(/<:/g) != null ? reponse[i].content.toString().match(/(:\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d>)/g).replace(/\D/g, '').
        // /(:\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d>)/g
        //https://cdn.discordapp.com/emojis/${emoji.id}./

        // const str = 'Mozill  <:check:797170017691107328>  sfgr <:check:797170017664107327> e <:g:>ga';
        // const s = str.replace(/(\d{18})/g, '<img style="width: 20px; ">https://cdn.discordapp.com/emojis/$1');
        // const  w = s.replace(/(..)(?<=<:)(.*?)(?=:)(.)/g, '').replace(/>/g, '')
        // console.log(w)

        html += `<div class="msg-unit">${
                    reponse[i].author != (i-1 < 0 ? '' : reponse[i-1].author) ? `
                        <div class="space"></div>
                        <div class="item username">
                            <a style="color: ${reponse[i].color === '#000000' ? '#fff' : reponse[i].color}" href="${reponse[i].author_link}">${reponse[i].author}</a>
                            ${reponse[i].bot == true ? '<bot class="bot">BOT</bot>' : ''}
                            <time class="time">
                                ${date}
                            </time>
                        </div>
                        ` : '' 
                    }

                    <div class="item msg">
                        ${reponse[i].content.replace(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, '<a id="open-link" onclick="shell.openExternal(`$1`);" >$1</a>')}
                        ${reponse[i].image.length > 0 ? `<a onclick="shell.openExternal('${reponse[i].image}');" class="imagePopup"><img class="image-Popup" src="${reponse[i].image}"></img></a>` : ''}
                    </div>
                </div>
                `;
    }

    channel_query = reponse[0].server + '/' + reponse[0].channel_id
    if (document.getElementById("wait_img"))
        document.getElementById("wait_img").hidden = true;
    document.getElementById("upload").style.cursor = 'pointer';
    document.getElementById("channel").channel_id = channel_query;
    document.getElementById("messages").innerHTML = html;
    document.getElementById("channelText").innerHTML = reponse[0].channel_name;
    document.getElementById("inputBoxText").placeholder = 'Envoyer un message à #' + reponse[0].channel_name;
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;

});


function minimise() {
    console.log('min')
    ipc.send('minimize')
}
function open_discord() {
    ipc.send('discord_open', document.getElementById("channel").channel_id)
}
function closeApp() {
    console.log('close')
    ipc.send('closeApp')
}

function upload() {
    ipc.send('file_upload')
}

function url_open(url) {
    console.log(url)
    ipc.send('open_link', url)
}




function select_channel() {
    document.getElementById("messages").innerHTML = `
                <div id="selection" class="selection" style="display:none">
                    <div class="server_selection_bg"></div>
                    <div id="server_selection" class="server_selection">
                        </div>
                    <div class="channels_div">
                        <div id="channel_selection" class="channel_selection">

                        </div>
                    </div>
                </div>`;

    try {document.getElementById("wait_img").style.display = 'none'} catch (e) {}
    try {document.getElementById('selection').style.display = 'block'} catch (e) {}
    try {document.getElementById('msg-unit').hidden = true} catch (e) {}
    //try {document.getElementById('messages').style.display = 'none'} catch (e) {}

    ipc.send('get_server_list')
}

ipc.on('server_list', function (event, servers_list) {
    let html = '';
    for (let i=0; i < servers_list.length; i++) {
        html += `<div class="server-scroll-list">
                    <div class="server_icon">
                        <a onclick="channel_call('${servers_list[i].id}')">
                            <img id="server_logo" src="${servers_list[i].icon}" alt="">
                        </a>
                    </div>
                    <span class="server-title-popup">${servers_list[i].name}</span>
                </div>`
    }
    document.getElementById("server_selection").innerHTML = html;
})

function channel_call(guild) {
    console.log(guild)
    ipc.send('get_channels_list', guild)
}

ipc.on('channels_list', function (event, channels_list) {
    let html = '';
    for (let i=0; i < channels_list.length; i++) {
        html += `<div class="channel_item_bg">
                    <div class="hashtag">#</div>
                    <div class="channel_item">
                        <a onclick="channel_set('${channels_list[i].id}')">
                            ${channels_list[i].name}
                        </a>
                    </div>
                </div>`
    }
    document.getElementById("channel_selection").innerHTML = html;
})

function channel_set(channel_set) {
    console.log(channel_set)
    ipc.send('channel_set', channel_set)
}