import Bowser from 'bowser';

export class Browser {
  public get name() {
    const browser = Bowser.getParser(window.navigator.userAgent);

    return browser.getBrowserName();
  }

  public get osName() {
    const browser = Bowser.getParser(window.navigator.userAgent);

    return browser.getOSName();
  }
}
