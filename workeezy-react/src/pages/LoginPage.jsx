import LoginButton from "../components/LoginButton/LoginButton";
import LoginInputs from "../components/LoginInputs/LoginInputs";
import LoginOptions from "../components/LoginOptions/LoginOptions";
import SocialLoginButtons from "../components/SocialLoginButtons/SocialLoginButtons";
import PageLayout from "../layout/PageLayout";

export default function LoginPage (){

    return(
        <PageLayout>
            <LoginInputs/>
            <LoginOptions/>
            <LoginButton/>
            <SocialLoginButtons/>
        </PageLayout>

    )
}