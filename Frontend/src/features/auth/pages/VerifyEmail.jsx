import { useEffect } from "react";
import { useSearchParams } from "react-router";
import useAuth from "../hooks/useAuth";

const VerifyEmail = () => {
    const [params] = useSearchParams();
    const { verifyEmail } = useAuth();

    useEffect(() => {
        const token = params.get("token");

        if (!token) return;

        verifyEmail(token)
            .then((html) => {
                document.open();
                document.write(html);
                document.close();
            })
            .catch(() => {});
    }, [params]);

    return <p className="p-6 text-sm">Verifying...</p>;
};

export default VerifyEmail;
