function Boundary(x, y, w, h, extraOpt) {
  const options = {
    friction: 0.02,
    restitution: 0,
    isStatic: true,
    ...extraOpt,
  }
  this.physicalBody = Matter.Bodies.rectangle(x, y, w, h, options);
  this.vertices = this.physicalBody.vertices;
  this.form = new PIXI.Graphics();

  Matter.World.add(engine.world, this.physicalBody);
  app.stage.addChild(this.form);
  

  this.show = () => {
    this.form.clear();
    this.form.lineStyle(2, 0x956956, 1, 0);
    this.form.beginFill(0x056056);

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