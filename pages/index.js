import { MongoClient } from "mongodb";

import Head from "next/head";
import { Fragment } from "react";
import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React meetups</title>
        <meta name="description" content="Highly active meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// NOTE: [getStaticProps] and [getServerSideProps] are very important key concepts of nextJS.
// ======================================================================================

// All the code runs on server side and nothing on client side
// useful to save cedentials which are not to be exposed to clients/ users
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: DUMMY_MEETUPS,
//   };
// }

// data fetching for pre-rendering
// First the getStaticProps function promise will be resolved before executing the above function.
export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://mongoose-mongodb:1234@cluster0.qwybnjp.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  const allMeetups = JSON.parse(JSON.stringify(meetups));

  client.close();
  // NOTE: the code in this function is executed during build process so it will never be seen on client side.
  // This function returns an OBJECT always.
  return {
    props: {
      meetups: allMeetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
