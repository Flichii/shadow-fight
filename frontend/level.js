const COLOR_PALETTE = {
  PRIMARY: '#00070A',
  SECONDARY: '#294552',
  TERTIARY: '#597884',
  QUATERNARY: '#ACC4CE',
  QUINTERNARY: '#9EB9B3'
};

const LEVEL_CONSTANTS = {
  MAX_TIME: 60 * 120,
  TIMER_TEXT_HEIGHT: 75,
  TIMER_RADIUS: 45,
  MAX_HEALTH: 200,
  HEALTH_BAR: {
    width: 350,
    height: 20
  },
  OFFSET: 20
};

export default class Level {
  constructor(ctx, dimensions) {
    this.dimensions = dimensions;
    this.time = LEVEL_CONSTANTS.MAX_TIME;
    this.ctx = ctx;

    this.playerHpPos = {
      x: this.dimensions.width / 2 - LEVEL_CONSTANTS.TIMER_RADIUS,
      y: LEVEL_CONSTANTS.TIMER_RADIUS - LEVEL_CONSTANTS.HEALTH_BAR.height + 5
    };

    this.botHpPos = {
      x: this.dimensions.width / 2 + LEVEL_CONSTANTS.TIMER_RADIUS,
      y: LEVEL_CONSTANTS.TIMER_RADIUS - LEVEL_CONSTANTS.HEALTH_BAR.height + 5
    };

    this.drawTimerCircle = this.drawTimerCircle.bind(this);
    this.drawTimerDisplay = this.drawTimerDisplay.bind(this);
    this.drawTimerText = this.drawTimerText.bind(this);
    this.drawHealthBars = this.drawHealthBars.bind(this);
    this.drawNames = this.drawNames.bind(this);
  }

  animate(playerHealth, botHealth) {
    let time =  this.drawTimer();
    this.drawHealthBars();
    this.drawCurrentHealthBars(playerHealth, botHealth);
    this.drawNames();
    return time;
  }

  drawTimer() {
    // TODO: Need better solution
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.drawTimerCircle();
    this.drawTimerDisplay();
    this.drawTimerText();

    
    this.time = this.time - 1;
    if (this.time === 0) {
      let returnTime = 0;
      this.time = LEVEL_CONSTANTS.MAX_TIME;
      return returnTime;
    }
  }

  drawTimerText() {
    this.ctx.font = '42px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = 'WHITE';
    this.ctx.strokeStyle = COLOR_PALETTE.PRIMARY;
    this.ctx.fillText(
      `${Math.round(this.time / 60)}`,
      this.dimensions.width / 2,
      LEVEL_CONSTANTS.TIMER_TEXT_HEIGHT + 8
    );
    this.ctx.strokeText(
      `${Math.round(this.time / 60)}`,
      this.dimensions.width / 2,
      LEVEL_CONSTANTS.TIMER_TEXT_HEIGHT + 8
    );
  }

  drawTimerCircle() {
    this.ctx.beginPath();
    this.ctx.fillStyle = COLOR_PALETTE.SECONDARY;
    this.ctx.arc(
      this.dimensions.width / 2,
      LEVEL_CONSTANTS.TIMER_TEXT_HEIGHT - 5,
      LEVEL_CONSTANTS.TIMER_RADIUS, 0, 2 * Math.PI
      );
    this.ctx.fill();
  }

  drawTimerDisplay() {
    this.ctx.beginPath();
    this.ctx.fillStyle = COLOR_PALETTE.QUATERNARY;
    this.ctx.arc(
      this.dimensions.width / 2,
      LEVEL_CONSTANTS.TIMER_TEXT_HEIGHT - 5,
      LEVEL_CONSTANTS.TIMER_RADIUS,
      - 0.5 * Math.PI,
      (LEVEL_CONSTANTS.MAX_TIME - this.time)
      * 2 * Math.PI / LEVEL_CONSTANTS.MAX_TIME
      - 0.5 * Math.PI
    );
    this.ctx.lineTo(this.dimensions.width / 2,
      LEVEL_CONSTANTS.TIMER_TEXT_HEIGHT - 5
    );
    this.ctx.fill();
  }

  drawHealthBars() {
    // Player health container
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'BLACK';
    this.ctx.moveTo(
      this.playerHpPos.x,
      this.playerHpPos.y
    );
    this.ctx.lineTo(
      this.playerHpPos.x - LEVEL_CONSTANTS.HEALTH_BAR.width,
      this.playerHpPos.y
    );
    this.ctx.lineTo(
      this.playerHpPos.x - LEVEL_CONSTANTS.HEALTH_BAR.width,
      this.playerHpPos.y + LEVEL_CONSTANTS.HEALTH_BAR.height
    );
    this.ctx.lineTo(
      this.playerHpPos.x - LEVEL_CONSTANTS.OFFSET,
      this.playerHpPos.y + LEVEL_CONSTANTS.HEALTH_BAR.height
    );
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    //bot health container
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'BLACK';
    this.ctx.moveTo(
      this.botHpPos.x,
      this.botHpPos.y
    );
    this.ctx.lineTo(
      this.botHpPos.x + LEVEL_CONSTANTS.HEALTH_BAR.width,
      this.botHpPos.y
    );
    this.ctx.lineTo(
      this.botHpPos.x + LEVEL_CONSTANTS.HEALTH_BAR.width,
      this.botHpPos.y + LEVEL_CONSTANTS.HEALTH_BAR.height
    );
    this.ctx.lineTo(
      this.botHpPos.x + LEVEL_CONSTANTS.OFFSET,
      this.botHpPos.y + LEVEL_CONSTANTS.HEALTH_BAR.height
    );
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawCurrentHealthBars(playerHealth, botHealth) {
    let currentHealth = LEVEL_CONSTANTS.HEALTH_BAR.width * playerHealth / LEVEL_CONSTANTS.MAX_HEALTH;

    // Player current health
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'BLACK';
    this.ctx.fillStyle = 'RED';
    this.ctx.moveTo(
      this.playerHpPos.x,
      this.playerHpPos.y
    );
    this.ctx.lineTo(
      this.playerHpPos.x - currentHealth,
      this.playerHpPos.y
    );
    if (currentHealth < LEVEL_CONSTANTS.OFFSET) {
      this.ctx.lineTo(
        this.playerHpPos.x - currentHealth,
        // currentHealth = currentHealth * tan(pi/4)
        // since offset = height
        this.playerHpPos.y + currentHealth
      );
    } else {
      this.ctx.lineTo(
        this.playerHpPos.x - currentHealth,
        this.playerHpPos.y + LEVEL_CONSTANTS.HEALTH_BAR.height
      );
      this.ctx.lineTo(
        this.playerHpPos.x - LEVEL_CONSTANTS.OFFSET,
        this.playerHpPos.y + LEVEL_CONSTANTS.HEALTH_BAR.height
      );
    };
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    let currentBotHealth = LEVEL_CONSTANTS.HEALTH_BAR.width * botHealth / LEVEL_CONSTANTS.MAX_HEALTH;

    // Bot current health
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'BLACK';
    this.ctx.fillStyle = 'RED';
    this.ctx.moveTo(
      this.botHpPos.x,
      this.botHpPos.y
    );
    this.ctx.lineTo(
      this.botHpPos.x + currentBotHealth,
      this.botHpPos.y
    );
    if (currentBotHealth < LEVEL_CONSTANTS.OFFSET) {
      this.ctx.lineTo(
        this.botHpPos.x + currentBotHealth,
        // currentBotHealth = currentBotHealth * tan(pi/4)
        // since offset = height
        this.botHpPos.y + currentBotHealth
      );
    } else {
      this.ctx.lineTo(
        this.botHpPos.x + currentBotHealth,
        this.botHpPos.y + LEVEL_CONSTANTS.HEALTH_BAR.height
      );
      this.ctx.lineTo(
        this.botHpPos.x + LEVEL_CONSTANTS.OFFSET,
        this.botHpPos.y + LEVEL_CONSTANTS.HEALTH_BAR.height
      );
    };
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawNames() {
    let playerName = 'whsdgfsdfsdfat';
    let botName = 'bot';
    let playerNamePos = {
      x: this.playerHpPos.x - LEVEL_CONSTANTS.OFFSET,
      y: this.playerHpPos.y + LEVEL_CONSTANTS.TIMER_RADIUS + 8
    };
    let botNamePos = {
      x: this.botHpPos.x + LEVEL_CONSTANTS.OFFSET,
      y: this.botHpPos.y + LEVEL_CONSTANTS.TIMER_RADIUS + 8
    };

    this.ctx.font = '32px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = COLOR_PALETTE.PRIMARY;
    this.ctx.textAlign = 'right';
    this.ctx.fillText(playerName, playerNamePos.x, playerNamePos.y);
    this.ctx.strokeText(playerName, playerNamePos.x, playerNamePos.y);

    this.ctx.textAlign = 'left';
    this.ctx.fillText(botName, botNamePos.x, botNamePos.y);
    this.ctx.strokeText(botName, botNamePos.x, botNamePos.y);
  }

}