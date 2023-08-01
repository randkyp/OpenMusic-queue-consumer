const { Pool } = require("pg");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const queryPlaylist = {
      text: `SELECT playlists.id AS "id", playlists.name AS "name"
        FROM playlists
        JOIN users ON users.id = playlists.owner
        WHERE playlists.id = $1;`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(queryPlaylist);

    const querySongs = {
      text: `SELECT songs.id AS "id", songs.title AS "title",
        songs.performer AS "performer"
        FROM playlists
        JOIN playlists_songs ON playlists_songs.playlist_id = playlists.id
        JOIN songs ON songs.id = playlists_songs.song_id
        WHERE playlists.id = $1;`,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(querySongs);

    return {
      playlist: {
        ...playlistResult.rows[0],
        songs: songsResult.rows.map((song) => ({
          id: song.id,
          title: song.title,
          performer: song.performer,
        })),
      },
    };
  }
}

module.exports = PlaylistsService;
