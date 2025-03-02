const error = (code: number, msg: string) => {
  let error: any = new Error(msg);
  error.code = code;
  return error;
};

export default error;
