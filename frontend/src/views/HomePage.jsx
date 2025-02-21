import NowPlaying from "../Services/NowPlaying";
import TopTracks from "../Services/TopTracks";
import UserPlaylists from "../Services/UserPlaylists";

const HomePage = () => {
    return (
        <div className="p-6 space-y-8">
            <NowPlaying />
            <TopTracks />
            <UserPlaylists />
        </div>
    );
};

export default HomePage;