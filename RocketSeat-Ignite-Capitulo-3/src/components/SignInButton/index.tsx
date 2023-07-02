import styles from "../SignInButton/styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";
import { BiLogIn } from "react-icons/bi";

export function SignInButton() {
  const { data: session } = useSession();

  return session ? (
    <button type="button" className={styles.signInButton} onClick={() => signOut()}>
      <FaGithub color="#04d361" />
      <div className={styles.logOut}>
        <span>{session.user.name}</span>
      </div>
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button type="button" className={styles.signInButton} onClick={() => signIn("github")}>
      <FaGithub color="#eba417" />
      <div className={styles.sigIn}>
        <span>Sign in With GitHub</span>
      </div>
    </button>
  );
}
