import {useMutationOptions} from "../../../hook/QueryCustom";
import {useMutation} from "@tanstack/react-query";
import {useStoreAction} from "../../../provider/StoreProvider";
import {LoadingButton} from "@mui/lab";
import {useState} from "react";
import {AlertDialog} from "../../view/dialog/AlertDialog";
import {initialApi, safeApi} from "../../../app/api";

type Props = {
    safe: boolean,
}

export function EraseButton(props: Props) {
    const {clear} = useStoreAction()
    const [open, setOpen] = useState(false)

    const cleanOptions = useMutationOptions([["info"]], clear)
    const cleanInitial = useMutation({mutationFn: initialApi.erase, ...cleanOptions})
    const cleanSafe = useMutation({mutationFn: safeApi.erase, ...cleanOptions})

    return (
        <>
            <LoadingButton
                size={"small"}
                color={"error"}
                variant={"outlined"}
                onClick={() => setOpen(true)}
                loading={cleanSafe.isPending || cleanInitial.isPending}
            >
                Erase
            </LoadingButton>
            <AlertDialog
                open={open}
                title={"Erase all data?"}
                content={`This action will remove all of your data (passwords, certs, logs, queries, etc).`}
                onAgree={() => props.safe ? cleanSafe.mutate() : cleanInitial.mutate()}
                onClose={() => setOpen(false)}
            />
        </>
    )
}
