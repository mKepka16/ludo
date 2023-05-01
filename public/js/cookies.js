class Cookies {
  static init() {
    if (
      !document.cookie.includes('cookie') &&
      document.location.pathname == '/'
    ) {
      document.cookie = 'cookie={}; expires=0; path=/';
    }
  }

  static getItem(item) {
    this.init();
    console.log(
      'first',
      document.cookie,
      'second',
      document.cookie.split('=')[1]
    );
    let cookies = JSON.parse(document.cookie.split('=')[1]);
    return cookies[item];
  }

  static setItem(key, value) {
    this.init();
    const cookies = JSON.parse(document.cookie.split('=')[1]);
    cookies[key] = value;
    const toSave = JSON.stringify(cookies);
    document.cookie = `cookie=${toSave}; expires=0; path=/`;
  }

  static removeItem(key) {
    this.init();
    const cookies = JSON.parse(document.cookie.split('=')[1]);
    delete cookies[key];
    const toSave = JSON.stringify(cookies);
    document.cookie = `cookie=${toSave}; expires=0; path=/`;
  }
}

export default Cookies;
