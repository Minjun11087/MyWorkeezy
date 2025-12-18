import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import "./TossPaymentWidget.css";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "Um80kmzhfkS_17JxBHT4l";

export function TossPaymentWidget() {

    const [amount, setAmount] = useState({
        currency: "KRW",
        value: 50000,
    });

    const [widgets, setWidgets] = useState(null);

    useEffect(() => {
        async function init() {

            // 1️⃣ Toss 초기화
            const tossPayments = await loadTossPayments(clientKey);

            const instance = tossPayments.widgets({
                customerKey,
            });

            setWidgets(instance);
        }

        init();
    }, []);

    useEffect(() => {
        if (!widgets) return;

        async function render() {

            // 2️⃣ 결제금액 세팅
            await widgets.setAmount(amount);

            // 3️⃣ UI 렌더링
            await Promise.all([
                widgets.renderPaymentMethods({
                    selector: "#payment-method",
                    variantKey: "DEFAULT",
                }),
                widgets.renderAgreement({
                    selector: "#agreement",
                    variantKey: "AGREEMENT",
                }),
            ]);
        }

        render();
    }, [widgets]);

    return (
        <div className="overlay">
            <div className="overlay-card">

                {/* 위젯 : 결제수단 표기 */}
                <div id="payment-method" />

                {/* 위젯 : 결제 약관 */}
                <div id="agreement" />

                {/* 이건 Toss 위젯 내부 버튼 누르면 진행됨 → 별도 버튼 필요없음 */}

            </div>
        </div>
    );
}


// import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
// import { useEffect, useState } from "react";
//
// const clientKey = "test_...";
// const customerKey = "user-xxx";
//
// export function TossPaymentWidget() {
//     const [amount, setAmount] = useState({ currency: "KRW", value: 50_000 });
//     const [ready, setReady] = useState(false);
//     const [widgets, setWidgets] = useState(null);
//
//     // 1) 위젯 초기화
//     useEffect(() => {
//         async function fetchPaymentWidgets() {
//             const tossPayments = await loadTossPayments(clientKey);
//             const widgets = tossPayments.widgets({ customerKey });
//             setWidgets(widgets);
//         }
//         fetchPaymentWidgets();
//     }, []);
//
//     // 2) 위젯 렌더링
//     useEffect(() => {
//         async function renderPaymentWidgets() {
//             if (!widgets) return;
//
//             await widgets.setAmount(amount);
//
//             await Promise.all([
//                 widgets.renderPaymentMethods({
//                     selector: "#payment-method",
//                     variantKey: "DEFAULT",
//                 }),
//                 widgets.renderAgreement({
//                     selector: "#agreement",
//                     variantKey: "AGREEMENT",
//                 }),
//             ]);
//
//             setReady(true);
//         }
//         renderPaymentWidgets();
//     }, [widgets]);
//
//     // 3) amount 변경 시 반영
//     useEffect(() => {
//         if (!widgets) return;
//         widgets.setAmount(amount);
//     }, [widgets, amount]);
//
//     return (
//         <div className="overlay">
//             <div className="overlay-card">
//                 <div id="payment-method" />
//                 <div id="agreement" />
//
//                 <button
//                     disabled={!ready}
//                     onClick={async () => {
//                         try {
//                             await widgets.requestPayment({
//                                 // orderId, orderName, amount 등 실제 값으로 교체
//                                 successUrl: "https://.../payment/result?status=success",
//                                 failUrl: "https://.../payment/result?status=fail",
//                             });
//                         } catch (e) {
//                             console.error(e);
//                         }
//                     }}
//                 >
//                     결제하기
//                 </button>
//             </div>
//         </div>
//     );
// }