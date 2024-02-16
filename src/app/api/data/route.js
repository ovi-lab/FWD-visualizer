
export async function POST() {
    const baseUrl = new URL(import.meta.url);
    const jsonDataUrl = new URL('../../data/new_robot_data_2_15.json', baseUrl).href;
fetch(jsonDataUrl)
    .then((res) => res.json())
      .then((data) => {
        console.log(data)
        return data
      })
}