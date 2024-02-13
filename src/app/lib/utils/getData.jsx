
export async function getData() {
    const res = fetch('../data/new_robot_data.json')

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }

    const JSONdata = await res.json()

    console.log("FUNC DATA:   " + JSON.stringify(JSONdata))
    return JSONdata
  };

  
