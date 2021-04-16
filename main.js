const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const electron = require('electron')
const Discord = require('discord.js');
const open = require('open');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const ipc = electron.ipcMain

client.login(require('./config.json').token);

function createWindow() {
	const win = new BrowserWindow({
		width: 400,
		height: 405,
		icon: "./logo.png",
		transparent: true,
		frame: false,
		fullscreenable: false,
		fullscreen: false,
		maximizable: false,
		resizable: false,
		webPreferences: {
			nodeIntegration: true
		}
	})

	win.setAlwaysOnTop(true, 'screen');
	win.loadURL(`file://${__dirname}/index.html`);
	//win.webContents.openDevTools()


	client.on('ready', async () => {
		console.log('[Discord Bot] Status: OK')
		win.webContents.send('updateValue', 'online');
	})

	let channel;

	ipc.on('channel_set', function (event, channel_set) {
		channel = channel_set
		setup(channel)
	})

	client.on('message', async message => {
		if (channel) {
			let msg_build = [];

			if (message.channel.id == channel) {
				message.channel.messages.fetch({ limit: 20 }).then(messages => {
					messages.forEach(element => {
						let hex;
						let image = '';
						let name;
						try {
							hex = element.member.displayHexColor;
						} catch (e) {
							hex = '#fff'
						}
						if (element.attachments.size > 0) {
							element.attachments.forEach(function (attachment) {
								console.log(attachment.url);
								image = attachment.url
							})
						}
						try {
							name = element.member.displayName
						} catch (e) {
							name = element.author.username
						}
						msg_build.push({
							content: element.content,
							channel_name: element.channel.name,
							channel_id: element.channel.id,
							author: name,
							color: hex,
							bot: element.author.bot,
							time: element.createdTimestamp,
							server: element.guild.id,
							image: image,
							author_link: 'discord://discord.com/users/' + element.author.id
						})
					});
					console.log(msg_build)
					win.webContents.send('discord_new_messages', msg_build);

				})
			}
		}
	})
	function setup(channel) {
		let msg_build = [];
		const channel_search = client.channels.cache.get(channel)
		channel_search.messages.fetch({ limit: 20 }).then(messages => {
			messages.forEach(element => {
				let hex;
				let image = '';
				let name;
				try {
					hex = element.member.displayHexColor;
				} catch (e) {
					hex = '#fff'
				}
				if (element.attachments.size > 0) {
					element.attachments.forEach(function (attachment) {
						console.log(attachment.url);
						image = attachment.url
					})
				}
				try {
					name = element.member.displayName
				} catch (e) {
					name = element.author.username
				}
				console.log(element.attachments.size > 0)
				msg_build.push({
					content: element.content,
					channel_name: element.channel.name,
					channel_id: element.channel.id,
					author: name,
					bot: element.author.bot,
					color: hex,
					time: element.createdTimestamp,
					server: element.guild.id,
					image: image,
					author_link: 'discord://discord.com/users/' + element.author.id
				})

			});
			console.log(msg_build)
			win.webContents.send('discord_new_messages', msg_build);

		})

	}

	ipc.on('typingIn', async function () {
		try {
			await client.channels.cache.get(channel).startTyping()
			await client.channels.cache.get(channel).stopTyping()
		} catch (e) {}
	})

	ipc.on('open_link', function (event, url) {
		open(url);
	});

	ipc.on('get_server_list', function (event) {
		let servers_list = []
		client.guilds.cache.forEach(g => {
			console.log(g.id)
			servers_list.push({
				name: g.name,
				id: g.id,
				icon: g.icon != null ? 'https://cdn.discordapp.com/icons/'+g.id+'/'+g.icon+'.png' : './discord-logo.png'
			})
		})
		console.log(servers_list)
		win.webContents.send('server_list', servers_list);
	})

	ipc.on('get_channels_list', function (event, serv) {
		let channels_list = []
		console.log('get '+serv)
		client.guilds.cache.get(serv).channels.cache.forEach(c => {
			console.log(c.type, c.name)
			if (c.type == 'text')
				channels_list.push({
					name: c.name,
					id: c.id
				})
		})
		console.log(channels_list)
		win.webContents.send('channels_list', channels_list);
	})

	ipc.on('minimize', function () {
		win.minimize()
	})

	ipc.on('file_upload', function () {
		if (channel) {
			const file = dialog.showOpenDialogSync({ properties: ['openFile'] })
			client.channels.cache.get(channel).send({
				files: file
			});
			console.log(file)
		}
	})

	ipc.on('discord-msg-send', function (event, arg) {
		console.log(arg)
		if (channel) {
			const channel_get = client.channels.cache.get(channel)
			channel_get.send(arg)
		} else {
			try {
				channel = client.channels.cache.get(arg).id
				setup(channel)
			} catch (e) {
				try {
					channel = client.channels.cache.find(c => c.name === arg).id
					setup(channel)
				} catch (e) {
					console.log('pas de chann')
					win.webContents.send('discord-msg-send', 'pas de channel');
				}

			}
		}
	})

	ipc.on('discord_open', function (event, arg) {
		console.log(arg)
		shell.openExternal(`discord://discord.com/channels/${arg}`)
	})

	ipc.on('closeApp', function () {
		//win.close()
		app.exit()
		console.log('test')

	})

}

ipc.on('message-synchrone', function (event, arg) {
	console.log(arg)
	event.returnValue = 'Oui voilà je réponds !'
})


app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})