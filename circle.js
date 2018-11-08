function Circle(x, y, r, fixed) {
  const options = {
    restitution: 0.8,
    isStatic: fixed,
  }
  this.physicalBody = Matter.Bodies.circle(x, y, r, options);
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
    this.form.drawCircle(this.physicalBody.position.x, this.physicalBody.position.y, this.physicalBody.circleRadius);
    this.form.lineStyle(2, 0xFF0FF0, 1, 0);
    this.form.moveTo(this.physicalBody.position.x, this.physicalBody.position.y);
    this.form.lineTo(
      this.physicalBody.vertices[0].x,
      this.physicalBody.vertices[0].y,
    );
    this.form.moveTo(this.physicalBody.position.x, this.physicalBody.position.y);
    this.form.lineTo(
      this.physicalBody.vertices[8].x,
      this.physicalBody.vertices[8].y,
    );
    this.form.moveTo(this.physicalBody.position.x, this.physicalBody.position.y);
    this.form.lineTo(
      this.physicalBody.vertices[16].x,
      this.physicalBody.vertices[16].y,
    );
    this.form.endFill();
  }
};