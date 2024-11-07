enum EIcons{
	home='iconzhuye',
	success = 'iconzhengque',
	close = 'iconguanbi',
	error = 'iconcuowu',
	warn = 'iconjinggao',
	info = 'iconxinxi',
	blog = 'iconblog',
	code = 'iconcode',
	about = 'iconset_about_hov',
	wechat = 'iconweixin',
	email = 'iconemail',
	github = 'icongithub',
	qq = 'iconsign_qq',
	arrowUp = 'iconiconfonticonfonti2copy',
	arrowDown = 'iconiconfonticonfonti2',
	empty = 'iconempty',
	chat = 'iconliuyan'
}

type TIcon = keyof typeof EIcons

export {
	EIcons,TIcon
}
