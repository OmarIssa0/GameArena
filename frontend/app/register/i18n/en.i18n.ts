const en = {
  title: "Create account",
  subtitle: "Fill in your details to get started",
  firstName: "First Name",
  firstNamePlaceholder: "Enter your first name",
  lastName: "Last Name",
  lastNamePlaceholder: "Enter your last name",
  username: "Username",
  usernamePlaceholder: "Enter your username",
  email: "Email",
  emailPlaceholder: "Enter your email",
  password: "Password",
  passwordPlaceholder: "Create a password",
  creating: "Creating account...",
  create: "Create account",
  haveAccount: "Already have an account?",
  signIn: "Sign in",
  joinUs: "Join Us Today",
  dynamicFieldRequired: (field: string) => `${field} is required`,
};

export default en;

export type TRegisterTranslation = typeof en;
