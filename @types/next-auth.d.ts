import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            nama: string;
            jabatan: string;
            role: string;
            is_akses_bacameter: boolean;
            is_user_ppob: boolean;
            list_authorized_page: any;
            ppob_token: string;
            api_version: string;
            is_active: boolean;
            deleted_at: Date | null;
            user_lokets: any;
        } & DefaultSession["user"];
    }

    interface DefaultUser {
        id: number;
        nama: string;
        jabatan: string;
        role: string;
        is_akses_bacameter: boolean;
        is_user_ppob: boolean;
        list_authorized_page: any;
        ppob_token: string;
        api_version: string;
        is_active: boolean;
        deleted_at: Date | null;
        user_lokets: any;
    }
}