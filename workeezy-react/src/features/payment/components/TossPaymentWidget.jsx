import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

const clientKey = "test_...";
const customerKey = "user-xxx";

export function TossPaymentWidget() {
    const [amount, setAmount] = useState({ currency: "KRW", value: 50_000 });
    const [ready, setReady] = useState(false);
    const [widgets, setWidgets] = useState(null);

    // 1) 위젯 초기화
    useEffect(() => {
        async function fetchPaymentWidgets() {
            const tossPayments = await loadTossPayments(clientKey);
            const widgets = tossPayments.widgets({ customerKey });
            setWidgets(widgets);
        }
        fetchPaymentWidgets();
    }, []);

    // 2) 위젯 렌더링
    useEffect(() => {
        async function renderPaymentWidgets() {
            if (!widgets) return;

            await widgets.setAmount(amount);

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

            setReady(true);
        }
        renderPaymentWidgets();
    }, [widgets]);

    // 3) amount 변경 시 반영
    useEffect(() => {
        if (!widgets) return;
        widgets.setAmount(amount);
    }, [widgets, amount]);

    return (
        <div className="overlay">
            <div className="overlay-card">
                <div id="payment-method" />
                <div id="agreement" />

                <button
                    disabled={!ready}
                    onClick={async () => {
                        try {
                            await widgets.requestPayment({
                                // orderId, orderName, amount 등 실제 값으로 교체
                                successUrl: "https://.../payment/result?status=success",
                                failUrl: "https://.../payment/result?status=fail",
                            });
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                >
                    결제하기
                </button>
            </div>
        </div>
    );
}