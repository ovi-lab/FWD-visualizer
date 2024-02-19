export async function POST() {
  fetch("new_robot_data_2_15.json")
    .then((res) =>
      res.json())
    .then((data) => {
      return data;
    });
}
