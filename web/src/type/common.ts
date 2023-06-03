import {CSSProperties, ReactElement} from "react";
import {SxProps, Theme} from "@mui/material";
import {SecretStatus} from "./secret";

// COMMON (WEB AND SERVER)

export interface Login {
    username: string,
    password: string,
}

export interface DbConnection {
    host: string,
    port: number,
    credId: string,
}

export enum FileUsageType {
    UPLOAD,
    PATH,
}

export interface Database {
    host: string,
    port: number,
    database?: string,
}

export interface Sidecar {
    host: string,
    port: number,
}

// SPECIFIC (WEB)

// TODO make it similar in server side
export interface Response<TData, TError = {}> {
    response: TData,
    error: TError,
}

export enum AuthType {
    NONE = "none",
    BASIC = "basic",
}

export interface AppInfo {
    company: string,
    version: { tag: string, commit: string }
    secret: SecretStatus,
    auth: { authorized: boolean, error: string, type: AuthType },
}

export interface Authentication {
    type: AuthType,
    body: any,
}


export interface StylePropsMap {
    [key: string]: CSSProperties,
}

export interface SxPropsMap {
    [key: string]: SxProps<Theme>,
}


export interface ColorsMap {
    [name: string]: "success" | "primary" | "error" | "warning",
}

export interface EnumOptions {
    name: string,
    label: string,
    icon: ReactElement,
    key: string,
    color?: string,
    badge?: string,
}

export enum Settings {
    MENU,
    PASSWORD,
    CERTIFICATE,
    SECRET,
    ABOUT,
}

export interface Links {
    [key: string]: {
        name: string,
        link: string,
    }
}
