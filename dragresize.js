class Draggable {
	constructor(root, options) {
		this.drag = {prevX: 0, prevY: 0};
		this.element = root;
		this.isDragging = false;
		this.cancel = false;
		this.force = false;
		let self = this;
		this.mouseUpEvent = () => {
			self.isDragging = false;
			self.cancel = false;
			self.force = false;
			document.body.style.cursor = "default";
		};
		this.rootMouseDownEvent = () => {
			self.isDragging = true;
			if (!self.element.isResizing && (!self.cancel || self.force) && !self.disabled) document.body.style.cursor = "move";
		};
		this.forceEvent = () => self.force = true;
		this.cancelEvent = () => self.cancel = true;
		this.forceElems = [];
		this.cancelElems = [];

		root.addEventListener("mousedown", this.rootMouseDownEvent);
		document.body.addEventListener("mouseup", this.mouseUpEvent);
		if (options.handle)
			this.element.querySelectorAll(options.handle).forEach(elem => {
				self.forceElems.push(elem);
				elem.addEventListener("mousedown", self.forceEvent)
			});
		if (options.cancel)
			this.element.querySelectorAll(options.cancel).forEach(elem => {
				self.cancelElems.push(elem);
				elem.addEventListener("mousedown", self.cancelEvent)
			});
		this.drag = function (e) {
			if (self.isDragging && !self.element.isResizing && (!self.cancel || self.force) && !self.disabled) {
				self.element.style.left = (e.clientX - self.drag.prevX) + "px";
				self.element.style.top = (e.clientY - self.drag.prevY) + "px";
			} else {
				self.drag.prevX = e.clientX - self.element.offsetLeft;
				self.drag.prevY = e.clientY - self.element.offsetTop;
			}
		};
		document.body.addEventListener("mousemove", this.drag);


	}

	disable() {
		this.disabled = true;
	}

	enable() {
		this.disabled = false;
	}

	destroy() {
		document.body.removeEventListener("mousemove", this.drag);
		this.cancelElems.forEach(elem => {
			elem.removeEventListener("mousedown", self.cancelEvent)
		});
		this.forceElems.forEach(elem => {
			elem.removeEventListener("mousedown", self.forceEvent)
		});
		this.element.removeEventListener("mousedown", this.rootMouseDownEvent);
		document.body.removeEventListener("mouseup", this.mouseUpEvent);
		delete this;
	}
}

class Resizable {
	constructor(root, options) {
		this.resize = {prevX: 0, prevY: 0};
		this.element = root;
		this.options = options || {
			triggerSize: 10,
			edges: {
				bottom: true,
				right: true
			}
		};
		let self = this;
		this.mouseUpHandler = () => self.element.isResizing = false;
		document.body.addEventListener("mouseup", this.mouseUpHandler);
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
			self.element.isResizing = e.currentTarget.resizer;
			self.resize.prevX = e.clientX;
			self.resize.prevY = e.clientY;
		}

		this.corners.topLeft.style.cssText = `position:absolute;top: -${size}px; left:-${size}px; width:${2 * size}px; height:${2 * size}px; cursor: nwse-resize`;
		this.corners.topLeft.resizer = 1;
		this.corners.topLeft.addEventListener("mousedown", triggerResizer);
		this.corners.top.style.cssText = `position:absolute;top: -${size}px; left:${size}px; width:calc(100% - ${2 * size}px); height:${2 * size}px; cursor: ns-resize`;
		this.corners.top.addEventListener("mousedown", triggerResizer);
		this.corners.top.resizer = 2;
		this.corners.topRight.style.cssText = `position:absolute;top: -${size}px; right:-${size}px; width:${2 * size}px; height:${2 * size}px; cursor: nesw-resize`;
		this.corners.topRight.addEventListener("mousedown", triggerResizer);
		this.corners.topRight.resizer = 3;
		this.corners.right.style.cssText = `position:absolute;top: ${size}px; right:-${size}px; width:${2 * size}px; height:calc(100% - ${2 * size}px); cursor: ew-resize`;
		this.corners.right.addEventListener("mousedown", triggerResizer);
		this.corners.right.resizer = 4;
		this.corners.bottomRight.style.cssText = `position:absolute;bottom: -${size}px; right:-${size}px; width:${2 * size}px; height:${2 * size}px; cursor: nwse-resize`;
		this.corners.bottomRight.addEventListener("mousedown", triggerResizer);
		this.corners.bottomRight.resizer = 5;
		this.corners.bottom.style.cssText = `position:absolute;bottom: -${size}px; left:${size}px; width:calc(100% - ${2 * size}px); height:${2 * size}px; cursor: ns-resize`;
		this.corners.bottom.addEventListener("mousedown", triggerResizer);
		this.corners.bottom.resizer = 6;
		this.corners.bottomLeft.style.cssText = `position:absolute;bottom: -${size}px; left: -${size}px; width:${2 * size}px; height:${2 * size}px; cursor: nesw-resize`;
		this.corners.bottomLeft.addEventListener("mousedown", triggerResizer);
		this.corners.bottomLeft.resizer = 7;
		this.corners.left.style.cssText = `position:absolute;top: ${size}px; left: -${size}px; width:${2 * size}px; height:calc(100% - ${2 * size}px); cursor: ew-resize`;
		this.corners.left.addEventListener("mousedown", triggerResizer);
		this.corners.left.resizer = 8;

		function resize(e) {
			e.stopImmediatePropagation();
			if (!self.element.isResizing) return;
			switch (self.element.isResizing) {
				case 1:
					self.element.style.top = (self.element.offsetTop + (e.clientY - self.resize.prevY)) + "px";
					self.element.style.height = (self.element.clientHeight - (e.clientY - self.resize.prevY)) + "px";
					self.element.style.left = (self.element.offsetLeft + (e.clientX - self.resize.prevX)) + "px";
					self.element.style.width = (self.element.clientWidth - (e.clientX - self.resize.prevX)) + "px";
					document.body.style.cursor = "";
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

		if (options.edges.left) {
			this.element.append(this.corners.left);
			if (options.edges.top)
				this.element.append(this.corners.topLeft);
			if (options.edges.bottom)
				this.element.append(this.corners.bottomLeft);
		}
		if (options.edges.bottom)
			this.element.append(this.corners.bottom);
		if (options.edges.right) {
			this.element.append(this.corners.right);
			if (options.edges.top)
				this.element.append(this.corners.topRight);
			if (options.edges.bottom)
				this.element.append(this.corners.bottomRight);
		}
		if (options.edges.top)
			this.element.append(this.corners.top);
		document.body.addEventListener("mousemove", resize);
	}

	disable() {
		if (this.disabled) return;
		this.disabled = true;
		for (const item of Object.values(this.corners)) item.style.pointerEvents = "none";
	}

	enable() {
		if (!this.disabled) return;
		this.disabled = false;
		for (const item of Object.values(this.corners)) item.style.pointerEvents = "initial";
	}

	destroy() {
		for (const item of Object.values(this.corners)) item.remove();
		document.removeEventListener("mouseup", this.mouseUpHandler);
		delete this;
	}
}