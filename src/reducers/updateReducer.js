export default (state, action) => {
    // console.log('Call Action => ', action, ' State => ', state, ' Spread => ', {
    //   ...state,
    //   notes: action.payload
    // });
    switch (action.type) {
      case "update":
        return {
          ...state,
          notes: action.payload
        };
      default:
        return state;
    }
};