import React, { Component, useEffect, useRef } from "react";
import "./chatBox.css";
import { scaleLinear } from "d3";

const ThreadSeparator = ({ex, idx, arr}) => {
  if (idx === 0 || ex.threadId !== arr[idx-1].threadId) {
    console.log(ex.threadId)
    return (
      <div>
      <hr
        id={`thread${ex.threadId}`}
        style={{
          width: '100%',
          border: '1px solid #000', // You can customize the line style
          margin: 0,
        }}
      />
      <p>{`Thread ${ex.threadId}`}</p>
      </div>
    )
  }
  else {
    return;
  }
}

const Bubble = ({ key, ex, id, setBubbleRef }) => {
  const speaker = ex.speaker === "HARU:" ? "Haru" : "User";
  const color = scaleLinear()
    .domain([-1, 0, 1])
    .range(["#dc3723", "white", "#99e699"]);

  // Currently unused refs
  // const bubbleRef = useRef(null);

  // useEffect(() => {
  //   setBubbleRef(id, bubbleRef.current);
  // }, [id, setBubbleRef]);

  return (
    <div key={key} className="bubbleContainer" id={`response${id}`}>
      {" "}
      {/*add ref={bubbleRef} to use refs*/}
      <div className={`timestamp ${speaker}`}>{ex.timestamp}</div>
      <div className={`bubble ${speaker}`}>
        <div
          className={`message`}
          style={{ backgroundColor: `${color(ex.sentiment_score)}` }}
        >
          <div className={`speaker ${speaker}`}>{speaker}</div>
          <div className={`text ${speaker}`}>{ex.text}</div>
        </div>
      </div>
    </div>
  );
};

class Chatbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      threads: [],
      exchanges: [],
      bubbleRefs: {},
      chatAnchor: null,
    };
  }
  // unused refs
  // setBubbleRef = (id, ref) => {
  //   this.setState((prevState) => ({
  //     bubbleRefs: { ...prevState.bubbleRefs, [id]: ref },
  //   }));
  // };

  componentDidMount() {
    this.loadData();
  }
  loadData() {
    const data = this.props.data;
    const threads = {};
    const exchanges = {};
    data.nodes.forEach((entry) => {
      const speaker = entry.name.match(/(.*):/)[0].trim();

      entry.interactions.forEach((interaction) => {
        const threadId = interaction.thread_id;
        if (!threads[threadId]) {
          threads[threadId] = [];
        }
        threads[threadId].push(interaction.id);
        exchanges[interaction.id] = {
          id: interaction.id,
          speaker: speaker,
          text: interaction.response,
          sentiment_score: interaction.sentiment,
          timestamp: interaction.timestamp,
          threadId: threadId,
        };
      });
    });

    this.setState({
      threads: threads,
      exchanges: Object.values(exchanges),
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.chatAnchor !== prevProps.chatAnchor) {
      // const { chatAnchor, bubbleRefs } = this.state;
      // const targetRef = bubbleRefs[chatAnchor];
      // console.log("All bubble refs:", this.state.bubbleRefs);
      // if (targetRef) {
      //   targetRef.scrollIntoView({ behavior: "smooth" });
      // }
      const targetElement = document.getElementById(this.props.chatAnchor);
      
      const targetContainer = document.getElementById("chatboxContent");

      if (targetElement && targetContainer) {
        // Calculate the scroll position to center the target element
        const scrollPosition =
          targetElement.offsetTop -
          (targetContainer.clientHeight - targetElement.clientHeight) / 2;
        targetContainer.scrollTo({ top: scrollPosition, behavior: "smooth" });
        if (prevProps.chatAnchor) {
          document.getElementById(prevProps.chatAnchor).style.border = "none";
        }
        targetElement.style.border = "5px solid #a5faee";
      }
    }
  }

  render() {
    const { threads, exchanges, chatAnchor } = this.state;

    return (
      <div className="flex flex-col h-screen col-span-2 chatbox-container">
        <h1>Conversation Transcript</h1>
        <div className="chatbox-body" style={{ overflow: "hidden" }}>
          <div
            className="chatbox-content"
            id="chatboxContent"
            style={{ overflowY: "scroll" }}
          >
            { exchanges.map((ex, idx, arr) => {
              return (
                <div> 
                <ThreadSeparator ex={ex} idx={idx} arr={arr}/>
                <Bubble
                  key={ex.id}
                  ex={ex}
                  id={ex.id}
                  setBubbleRef={this.setBubbleRef}
                />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Chatbox;
