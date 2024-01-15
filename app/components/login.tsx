import styles from "./login.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/bot.svg";

export function Login() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();

  const goChat = () => {
    if (accessStore.currentUser === "") {
      alert("用户名不能为空");
      return;
    }

    if (!accessStore.isAuthorized()) {
      alert("密码错误");
      return;
    }

    navigate(Path.Chat);
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>Lab</div>
      <div className={styles["auth-tips"]}>用户名</div>
      <input
        className={styles["auth-input"]}
        type="text"
        value={accessStore.currentUser}
        placeholder="请输入用户名"
        onChange={(e) => {
          accessStore.update(
            (access) => (access.currentUser = e.currentTarget.value),
          );
        }}
      />
      <input
        className={styles["auth-input"]}
        type="password"
        value={accessStore.currentPassword}
        placeholder="请输入密码"
        onChange={(e) => {
          accessStore.update(
            (access) => (access.currentPassword = e.currentTarget.value),
          );
        }}
      />

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Auth.Confirm}
          type="primary"
          onClick={goChat}
        />
      </div>
    </div>
  );
}
