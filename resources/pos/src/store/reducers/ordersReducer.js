import { orderActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case orderActionType.FETCH_ORDERS:
            return action.payload;
        case orderActionType.FETCH_ORDER:
            return action.payload;
        default:
            return state;
    }
};