import type { NextPage } from "next";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="email"
        value={email}
        list="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <datalist id="email">
        <option value="maikon@maikon" />
        <option value="diego@rocketseat.team" />
      </datalist>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Enviar</button>
    </form>
  );
};

export default Home;
