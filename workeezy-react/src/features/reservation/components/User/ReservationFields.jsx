import "./ReservationFields.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReservationFields({
  programTitle,
  userName,
  company,
  phone,
  email,
  startDate,
  endDate,
  peopleCount,
  onChange,
  rooms = [], // 해당 워케이션의 룸들
  roomId, // 사용자가 선택한 roomId
  roomType,
  offices = [],
  officeId,
  officeName,
  stayName,
  stayId,
  isAvailable,
  checking,
}) {
  console.log("🔥 rooms =", rooms);

  // 사용자가 select에서 옵션 바꿀 때마다 form에 roomId, roomType
  const handleSelectChange = (type, e) => {
    // 사용자가 선택한 option의 value(roomId) 객체 구조 분해 할당
    const { value } = e.target;

    if (type === "room") {
      // rooms 배열 안에서 사용자가 선택한 id와 일치하는 객체를 찾아서 selected에 저장
      const selected = rooms.find((r) => r.roomId === Number(value));

      // form에 roomId = value 저장
      onChange({ target: { name: "roomId", value } });
      // roomType = 룸타입 저장
      onChange({
        target: { name: "roomType", value: selected?.roomType || "" },
      });
    }
  };
  console.log("ReservationFields roomId =", roomId);

  const now = new Date();

  const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const endOfDay = (d) => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  };

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <>
      {/* 프로그램 제목 */}
      <div className="program-title">
        <div className="div">프로그램명</div>
        <div className="input">
          <input
            type="text"
            name="programTitle"
            value={programTitle || ""}
            onChange={onChange}
            readOnly
            className="value"
          />
        </div>
      </div>

      {/* 신청자명 */}
      <div className="user-name">
        <div className="div">신청자명</div>
        <div className="input">
          <input
            type="text"
            name="userName"
            value={userName}
            onChange={onChange}
            placeholder="이름을 입력하세요"
            className="value"
            readOnly
          />
        </div>
      </div>

      {/* 소속 */}
      <div className="user-company">
        <div className="div">소속</div>
        <div className="input">
          <input
            type="text"
            name="company"
            value={company}
            onChange={onChange}
            placeholder="소속을 입력하세요"
            className="value"
            readOnly
          />
        </div>
      </div>

      {/* 연락처 */}
      <div className="user-phone">
        <div className="div">연락처</div>
        <div className="input">
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={onChange}
            placeholder="010-0000-0000"
            className="value"
            readOnly
          />
        </div>
      </div>

      {/* 이메일 */}
      <div className="user-mail">
        <div className="div">이메일</div>
        <div className="input">
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="example@email.com"
            className="value"
            readOnly
          />
        </div>
      </div>

      {/* 예약 날짜 */}
      <div className="res-date">
        <div className="div">예약 날짜</div>
        <div className="date">
          <div className="started-at">
            {" "}
            <div className="input">
              <DatePicker
                selected={startDate}
                onChange={(date) =>
                  onChange({ target: { name: "startDate", value: date } })
                }
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                className="input-text"
                minDate={startOfDay(now)}
                minTime={
                  startDate &&
                  startOfDay(startDate).getTime() === startOfDay(now).getTime()
                    ? now
                    : startOfDay(now)
                }
                maxTime={endOfDay(startDate || now)}
              />
            </div>
          </div>

          <div className="ended-at">
            <div className="input">
              {/* <DatePicker
                selected={endDate}
                onChange={(date) =>
                  onChange({ target: { name: "endDate", value: date } })
                }
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                className="input-text"
                minDate={startDate ? startOfDay(startDate) : startOfDay(now)}
                minTime={
                  startDate && isSameDay(startDate, endDate)
                    ? startDate // 같은 날 → 시작시간 이후만
                    : startOfDay(endDate || now) // 다른 날 → 00:00부터
                }
                maxTime={endOfDay(endDate || now)}
              /> */}

              <DatePicker
                className="input-text"
                selected={endDate}
                readOnly
                dateFormat="yyyy-MM-dd HH:mm"
              />
            </div>
          </div>
        </div>
        <div className="availability-wrapper">
          {!checking && !isAvailable && (
            <span className="availability-error">이미 예약된 날짜입니다.</span>
          )}
          {!checking && isAvailable && (
            <span className="availability-success">
              예약이 가능한 날짜입니다.
            </span>
          )}
          {checking && (
            <span className="availability-checking">확인 중...</span>
          )}
        </div>
      </div>

      {/* 숙소명 */}
      <div className="stay-name">
        <div className="div">숙소명</div>
        <div className="input">
          <input
            type="text"
            name="stayName"
            value={stayName || ""}
            onChange={onChange}
            placeholder="숙소명"
            className="value"
            readOnly // 숙소는 고정이므로 선택 불필요
          />
        </div>
      </div>

      {/* 룸타입 */}
      <div className="roomtype">
        <div className="div">룸 타입</div>
        <div className="input">
          <select
            name="roomId"
            value={roomId || ""}
            onChange={(e) => handleSelectChange("room", e)}
            className="value"
          >
            {rooms.length === 0 && roomId && (
              <option value={roomId}>{roomType}</option>
            )}
            {rooms.map((r) => (
              <option key={r.roomId} value={String(r.roomId)}>
                {r.roomType}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 오피스 */}
      <div className="office">
        <div className="div">오피스</div>
        <div className="input">
          <input
            type="text"
            value={officeName || ""}
            readOnly
            className="value"
          />
        </div>
      </div>

      {/* 인원 */}
      <div className="people-count">
        <div className="div">인원</div>
        <div className="input">
          <input
            type="number"
            name="peopleCount"
            value={peopleCount}
            onChange={onChange}
            min="1"
            placeholder="1"
            className="value"
          />
        </div>
      </div>
    </>
  );
}
