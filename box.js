function Box(x, y, w, h) {
  const options = {
    friction: 0.03,
    restitution: 0.5,
    mass: 10,
  }
  this.physicalBody = Matter.Bodies.rectangle(x, y, w, h, options);
  this.vertices = this.physicalBody.vertices;
  this.form = new PIXI.Graphics();

  Matter.World.add(engine.world, this.physicalBody);
  app.stage.addChild(this.form);

  this.isOffScreen = () => {
    return (
      this.physicalBody.bounds.min.y > app.renderer.view.height
      || this.physicalBody.bounds.min.x > app.renderer.view.width
      || this.physicalBody.bounds.max.x < 0
    );
  }

  this.remove = () => {
    app.stage.removeChild(this.form);
    Matter.World.remove(engine.world, this.physicalBody);
  }

  this.show = () => {
    this.form.clear();
    this.form.lineStyle(1, 0xFF3300, 1, 0);
    this.form.beginFill(0x66CCFF);

    this.form.drawPolygon([
      this.vertices[0].x, this.vertices[0].y,             //First point
      this.vertices[1].x, this.vertices[1].y,             //Second point
      this.vertices[2].x, this.vertices[2].y,             //Third point
      this.vertices[3].x, this.vertices[3].y,             //Fourth point
      this.vertices[0].x, this.vertices[0].y,             //First point
    ]);

    this.form.endFill();
  }
};