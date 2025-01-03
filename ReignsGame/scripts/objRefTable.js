const C3 = self.C3;
self.C3_GetObjectRefTable = function () {
	return [
		C3.Plugins.TiledBg,
		C3.Plugins.Sprite,
		C3.Behaviors.Tween,
		C3.Behaviors.DragnDrop,
		C3.Behaviors.Pin,
		C3.Plugins.NinePatch,
		C3.Plugins.shadowlight,
		C3.Plugins.System.Cnds.OnLayoutStart,
		C3.Plugins.System.Acts.CreateObject,
		C3.Plugins.Sprite.Acts.SetInstanceVar,
		C3.Plugins.Sprite.Exps.X,
		C3.Behaviors.Tween.Acts.TweenOneProperty,
		C3.Plugins.Sprite.Acts.SetAngle,
		C3.Behaviors.DragnDrop.Acts.SetAxes,
		C3.Plugins.System.Cnds.IsGroupActive,
		C3.Plugins.System.Cnds.EveryTick,
		C3.Plugins.Sprite.Acts.RotateTowardAngle,
		C3.Behaviors.DragnDrop.Cnds.OnDrop,
		C3.Plugins.Sprite.Cnds.IsOverlapping,
		C3.Behaviors.Tween.Acts.TweenTwoProperties
	];
};
self.C3_JsPropNameTable = [
	{background: 0},
	{XStartingPosition: 0},
	{XDistance: 0},
	{Tween: 0},
	{DragDrop: 0},
	{Card: 0},
	{Pin: 0},
	{CardShadow: 0},
	{"9patch": 0},
	{DropAreaRight: 0},
	{DropAreaLeft: 0},
	{ShadowLight: 0}
];

self.InstanceType = {
	background: class extends self.ITiledBackgroundInstance {},
	Card: class extends self.ISpriteInstance {},
	CardShadow: class extends self.ISpriteInstance {},
	_9patch: class extends self.IWorldInstance {},
	DropAreaRight: class extends self.ISpriteInstance {},
	DropAreaLeft: class extends self.ISpriteInstance {},
	ShadowLight: class extends self.IShadowLightInstance {}
}