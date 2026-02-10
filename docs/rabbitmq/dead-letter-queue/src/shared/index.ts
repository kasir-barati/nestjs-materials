export interface GenericUserEvent<TUserInfo = any> {
  messageId: string;
  userInfo: TUserInfo;
}
