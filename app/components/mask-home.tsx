import { IconButton } from "./button";
import { ErrorBoundary } from "./error";

import styles from "./mask.module.scss";
import LightningIcon from "../icons/lightning.svg";
import AddIcon from "../icons/add.svg";

import { DEFAULT_MASK_AVATAR, Mask, useMaskStore } from "../store/mask";
import {
    ModelType,
    useChatStore,
} from "../store";

import {
    Select,
} from "./ui-lib";
import { Avatar } from "./emoji";
import Locale, { AllLangs, ALL_LANG_OPTIONS, Lang } from "../locales";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Path } from "../constant";

// drag and drop helper function
function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

function MaskAvatar(props: { avatar: string; model?: ModelType }) {
    return props.avatar !== DEFAULT_MASK_AVATAR ? (
        <Avatar avatar={props.avatar} />
    ) : (
        <Avatar model={props.model} />
    );
}


export function MaskHome() {
    const navigate = useNavigate();

    const maskStore = useMaskStore();
    const chatStore = useChatStore();

    const [filterLang, setFilterLang] = useState<Lang>();

    const allMasks = maskStore
        .getAll()
        .filter((m) => !filterLang || m.lang === filterLang);

    const [searchMasks, setSearchMasks] = useState<Mask[]>([]);
    const [searchText, setSearchText] = useState("");
    const masks = searchText.length > 0 ? searchMasks : allMasks;

    const startChat = (mask?: Mask) => {
        setTimeout(() => {
            chatStore.newSession(mask);
            navigate(Path.Chat);
        }, 10);
    };

    // refactored already, now it accurate
    const onSearch = (text: string) => {
        setSearchText(text);
        if (text.length > 0) {
            const result = allMasks.filter((m) =>
                m.name.toLowerCase().includes(text.toLowerCase()),
            );
            setSearchMasks(result);
        } else {
            setSearchMasks(allMasks);
        }
    };

    return (
        <ErrorBoundary>
            <div className={styles["mask-page"]}>
                <div className="window-header">
                    <div className={styles["mask-cards"]}>
                        <div className={styles["mask-card"]}>
                            <EmojiAvatar avatar="1f606" size={24} />
                        </div>
                        <div className={styles["mask-card"]}>
                            <EmojiAvatar avatar="1f916" size={24} />
                        </div>
                        <div className={styles["mask-card"]}>
                            <EmojiAvatar avatar="1f479" size={24} />
                        </div>
                    </div>

                    <div className={styles["title"]}>{Locale.NewChat.Title}</div>
                    <div className={styles["sub-title"]}>{Locale.NewChat.SubTitle}</div>

                    <div className={styles["actions"]}>
                        <IconButton
                            text={Locale.NewChat.Skip}
                            onClick={() => startChat()}
                            icon={<LightningIcon />}
                            type="primary"
                            shadow
                            className={styles["skip"]}
                        />
                    </div>
                </div>

                <div className={styles["mask-page-body"]}>
                    <div className={styles["mask-filter"]}>
                        <input
                            type="text"
                            className={styles["search-bar"]}
                            placeholder={Locale.Mask.Page.Search}
                            autoFocus
                            onInput={(e) => onSearch(e.currentTarget.value)}
                        />
                        <Select
                            className={styles["mask-filter-lang"]}
                            value={filterLang ?? Locale.Settings.Lang.All}
                            onChange={(e) => {
                                const value = e.currentTarget.value;
                                if (value === Locale.Settings.Lang.All) {
                                    setFilterLang(undefined);
                                } else {
                                    setFilterLang(value as Lang);
                                }
                            }}
                        >
                            <option key="all" value={Locale.Settings.Lang.All}>
                                {Locale.Settings.Lang.All}
                            </option>
                            {AllLangs.map((lang) => (
                                <option value={lang} key={lang}>
                                    {ALL_LANG_OPTIONS[lang]}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        {masks.map((m) => (
                            <div className={styles["mask-item"]} key={m.id}>
                                <div className={styles["mask-header"]}>
                                    <div className={styles["mask-icon"]}>
                                        <MaskAvatar avatar={m.avatar} model={m.modelConfig.model} />
                                    </div>
                                    <div className={styles["mask-title"]}>
                                        <div className={styles["mask-name"]}>{m.name}</div>
                                        <div className={styles["mask-info"] + " one-line"}>
                                            {`${Locale.Mask.Item.Info(m.context.length)} / ${ALL_LANG_OPTIONS[m.lang]
                                                } / ${m.modelConfig.model}`}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles["mask-actions"]}>
                                    <IconButton
                                        icon={<AddIcon />}
                                        text={Locale.Mask.Item.Chat}
                                        onClick={() => {
                                            chatStore.newSession(m);
                                            navigate(Path.Chat);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}
