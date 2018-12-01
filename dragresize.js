class DragResize {
	constructor(root, options) {
		this.prevX = root.offsetLeft;
		this.prevY = root.offsetTop;
		this.element = root;
		this.isDragging = false;
		this.cancel = false;
		this.force = false;
		let self = this;
		root.addEventListener("mousedown", e => {
			this.isDragging = true;
		});
		document.body.addEventListener("mouseup", e => {
			this.isDragging = false;
			this.cancel = false;
			this.force = false;
		});
		if(options.handle) {
			document.querySelectorAll(options.handle).forEach(elem => {
				elem.addEventListener("mousedown", e => self.force = true)
			})
		}
		if(options.cancel) {
			document.querySelectorAll(options.cancel).forEach(elem => {
				elem.addEventListener("mousedown", e => self.cancel = true)
			})
		}
		document.body.addEventListener("mousemove", drag);
		function drag(e) {
			console.log(self.isDragging);
			if(self.isDragging && (!self.cancel || self.force)) {
				self.element.style.left = CSS.px(e.clientX - self.prevX);
				self.element.style.top = CSS.px(e.clientY - self.prevY);
			} else {
				self.prevX = e.clientX - self.element.offsetLeft;
				self.prevY = e.clientY - self.element.offsetTop;
			}
		}
	}
}