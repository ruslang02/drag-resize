class DragResize {
	constructor(root, options) {
		this.drag = {prevX: 0, prevY: 0};
		this.resize = {prevX: 0, prevY: 0};
		this.element = root;
		this.isDragging = false;
		this.cancel = false;
		this.force = false;
		this.options = options || {
			cancel: null,
			handle: null,
			triggerSize: 10
		};
		let self = this;


		root.addEventListener("mousedown", () => this.isDragging = true);
		document.body.addEventListener("mouseup", () => {
			this.isDragging = false;
			this.isResizing = false;
			this.cancel = false;
			this.force = false;
		});
		if (options.handle)
			this.element.querySelectorAll(options.handle).forEach(elem => {
				elem.addEventListener("mousedown", () => self.force = true)
			});
		if (options.cancel)
			this.element.querySelectorAll(options.cancel).forEach(elem => {
				elem.addEventListener("mousedown", () => self.cancel = true)
			});
		document.body.addEventListener("mousemove", drag);
		function drag(e) {
			console.log(self.isDragging);
			if(self.isDragging && !self.isResizing && (!self.cancel || self.force)) {
				self.element.style.left = (e.clientX - self.drag.prevX) + "px";
				self.element.style.top = (e.clientY - self.drag.prevY) + "px";
			} else {
				self.drag.prevX = e.clientX - self.element.offsetLeft;
				self.drag.prevY = e.clientY - self.element.offsetTop;
			}
		}
		this.generateCorners()
	}
	generateCorners() {
		let self = this;
		let size = this.options.triggerSize ? this.options.triggerSize : 10;
		this.corners = {
			topLeft: document.createElement("div"),
			top: document.createElement("div"),
			topRight: document.createElement("div"),
			right: document.createElement("div"),
			bottomRight: document.createElement("div"),
			bottom: document.createElement("div"),
			bottomLeft: document.createElement("div"),
			left: document.createElement("div")
		};
		function triggerResizer(e) {
			self.isResizing = e.currentTarget.resizer;
			self.resize.prevX = e.clientX;
			self.resize.prevY = e.clientY;
		}
		this.corners.topLeft.style.cssText = `position:absolute;top: -${size}px; left:-${size}px; width:${2*size}px; height:${2*size}px`;
		this.corners.topLeft.resizer = 1;
		this.corners.topLeft.addEventListener("mousedown", triggerResizer);
		this.corners.top.style.cssText = `position:absolute;top: -${size}px; left:${size}px; width:calc(100% - ${2*size}px); height:${2*size}px`;
		this.corners.top.addEventListener("mousedown", triggerResizer);
		this.corners.top.resizer = 2;
		this.corners.topRight.style.cssText = `position:absolute;top: -${size}px; right:-${size}px; width:${2*size}px; height:${2*size}px`;
		this.corners.topRight.addEventListener("mousedown", triggerResizer);
		this.corners.topRight.resizer = 3;
		this.corners.right.style.cssText = `position:absolute;top: ${size}px; right:-${size}px; width:${2*size}px; height:calc(100% - ${2*size}px)`;
		this.corners.right.addEventListener("mousedown", triggerResizer);
		this.corners.right.resizer = 4;
		this.corners.bottomRight.style.cssText = `position:absolute;bottom: -${size}px; right:-${size}px; width:${2*size}px; height:${2*size}px`;
		this.corners.bottomRight.addEventListener("mousedown", triggerResizer);
		this.corners.bottomRight.resizer = 5;
		this.corners.bottom.style.cssText = `position:absolute;bottom: -${size}px; left:${size}px; width:calc(100% - ${2*size}px); height:${2*size}px`;
		this.corners.bottom.addEventListener("mousedown", triggerResizer);
		this.corners.bottom.resizer = 6;
		this.corners.bottomLeft.style.cssText = `position:absolute;bottom: -${size}px; left: -${size}px; width:${2*size}px; height:${2*size}px`;
		this.corners.bottomLeft.addEventListener("mousedown", triggerResizer);
		this.corners.bottomLeft.resizer = 7;
		this.corners.left.style.cssText = `position:absolute;top: ${size}px; left: -${size}px; width:${2*size}px; height:calc(100% - ${2*size}px)`;
		this.corners.left.addEventListener("mousedown", triggerResizer);
		this.corners.left.resizer = 8;
		function resize(e) {
			e.stopPropagation();
			let r = self.isResizing;
			if(r) {
				switch(r) {
					case 1:
						self.element.style.top = (self.element.offsetTop + (e.clientY - self.resize.prevY)) + "px";
						self.element.style.height = (self.element.clientHeight - (e.clientY - self.resize.prevY)) + "px";
						self.element.style.left = (self.element.offsetLeft + (e.clientX - self.resize.prevX)) + "px";
						self.element.style.width = (self.element.clientWidth - (e.clientX - self.resize.prevX)) + "px";
						break;
					case 2:
						self.element.style.top = (self.element.offsetTop + (e.clientY - self.resize.prevY)) + "px";
						self.element.style.height = (self.element.clientHeight - (e.clientY - self.resize.prevY)) + "px";
						break;
					case 3:
						self.element.style.top = (self.element.offsetTop + (e.clientY - self.resize.prevY)) + "px";
						self.element.style.height = (self.element.clientHeight - (e.clientY - self.resize.prevY)) + "px";
						self.element.style.width = (self.element.clientWidth + (e.clientX - self.resize.prevX)) + "px";
						break;
					case 4:
						self.element.style.width = (self.element.clientWidth + (e.clientX - self.resize.prevX)) + "px";
						break;
					case 5:
						self.element.style.width = (self.element.clientWidth + (e.clientX - self.resize.prevX)) + "px";
						self.element.style.height = (self.element.clientHeight + (e.clientY - self.resize.prevY)) + "px";
						break;
					case 6:
						self.element.style.height = (self.element.clientHeight + (e.clientY - self.resize.prevY)) + "px";
						break;
					case 7:
						self.element.style.left = (self.element.offsetLeft + (e.clientX - self.resize.prevX)) + "px";
						self.element.style.width = (self.element.clientWidth - (e.clientX - self.resize.prevX)) + "px";
						self.element.style.height = (self.element.clientHeight + (e.clientY - self.resize.prevY)) + "px";
						break;
					case 8:
						self.element.style.width = (self.element.clientWidth - (e.clientX - self.resize.prevX)) + "px";
						self.element.style.left = (self.element.offsetLeft + (e.clientX - self.resize.prevX)) + "px";
						break;
				}
				self.resize.prevX = e.clientX;
				self.resize.prevY = e.clientY;
			}
		}
		for(const item of Object.values(this.corners)) this.element.appendChild(item);
		document.body.addEventListener("mousemove", resize);
	}
}