
export default function actionCreator(type, data) {
  data = data || {};

  return {
    type: type,
    data
  }
}
