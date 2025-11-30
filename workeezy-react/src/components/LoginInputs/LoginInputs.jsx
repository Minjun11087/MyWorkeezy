import "./LoginInputs.css"

export default function LoginInputs(){
    return(
        <div class="component-5">
            <div class="input-field">
                <div class="label">아이디</div>
                <div class="input">
                <input
                    className="value"
                    type="text"
                    placeholder="아이디를 입력하세요"
                />
                </div>
            </div>
            <div class="input-field2">
                <div class="label">비밀번호</div>
                <div class="input2">
                <input
                    className="value"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                />
                </div>
            </div>
        </div>


    );
}