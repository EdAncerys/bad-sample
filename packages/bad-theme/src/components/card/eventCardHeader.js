import { connect } from "frontity";

import { colors } from "../../config/imports";
import date from "date-and-time";
const DATE_MODULE = date;
// --------------------------------------------------------------------------------
import { Parcer } from "../../context";

const EventCardHeader = ({ state, actions, libraries, eventHeader }) => {
  if (!eventHeader || !eventHeader.date_time) return null;

  const { date_time } = eventHeader;

  // SERVERS ---------------------------------------------
  const ServeDate = () => {
    if (!date_time) return null;

    return (
      <div>
        <div className="flex" style={{ gap: 10 }}>
          {date_time.map((block, key) => {
            const { date, end_time, start_time } = block;

            const dateObject = new Date(date);
            const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

            return (
              <div
                key={key}
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  paddingRight: `1em`,
                  backgroundColor: colors.lightSilver,
                }}
              >
                <Parcer libraries={libraries} html={formattedDate} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        className="flex"
        style={{
          padding: `0.5em`,
          fontSize: 12,
          letterSpacing: 2,
          borderRadius: 5,
          textTransform: "uppercase",
          marginBottom: `2em`,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <ServeDate />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(EventCardHeader);
