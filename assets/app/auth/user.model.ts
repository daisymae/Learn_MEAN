export class User {
  // do the same as the Message class, but with one line instead of 10
  // add public or private in front of the variable in the ctor to also make
  // it a member(property) of the class
  // adding ? after firstName and lastName makes them optional for creating the user
  constructor(public email: string,
              public password: string,
              public firstName?: string,
              public lastName?: string) {}
}