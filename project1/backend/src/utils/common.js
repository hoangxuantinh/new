export class Common {
  constructor() {}
  static returnData(status, message, user) {
    return {
      status,
      message,
      user,
    };
  }
  static responseForClient(res, response) {
    if (response.status === true) {
      return res.status(200).json({ status: true, message: response.message, user: response.user || {} });
    }
    return res.status(500).json({ status: false, message: response.message });
  }
}
