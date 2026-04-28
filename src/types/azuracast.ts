export interface AzuraStation {
    station: {
        id: number;
        name: string;
        shortcode: string;
        description: string;
        frontend: string;
        backend: string;
        listen_url: string;
        url: string;
        public_player_url: string;
        playlist_pls_url: string;
        playlist_m3u_url: string;
        is_public: boolean;
        mounts: Mount[];
        remotes: Remote[];
    };
    listeners: {
        total: number;
        unique: number;
        current: number;
    };
    live: {
        is_live: boolean;
        streamer_name: string | null;
        broadcast_start: number | null;
        art: string | null;
    } | null;
    now_playing: NowPlaying;
    playing_next: PlayingNext | null;
    song_history: SongHistory[];
    is_online: boolean;
    cache: string | null;
}

export interface Mount {
    id: number;
    name: string;
    url: string;
    bitrate: number;
    format: string;
    listeners: {
        total: number;
        unique: number;
        current: number;
    };
    is_default: boolean;
}

export interface Remote {
    id: number;
    name: string;
    url: string;
    bitrate: number;
    format: string;
    listeners: {
        total: number;
        unique: number;
        current: number;
    };
    is_default: boolean;
}

export interface NowPlaying {
    sh_id: number;
    played_at: number;
    duration: number;
    playlist: string | null;
    streamer: string | null;
    is_request: boolean;
    song: Song;
    elapsed: number;
    remaining: number;
}

export interface PlayingNext {
    cued_at: number;
    played_at: number;
    duration: number;
    playlist: string | null;
    is_request: boolean;
    song: Song;
}

export interface SongHistory {
    sh_id: number;
    played_at: number;
    duration: number;
    playlist: string | null;
    streamer: string | null;
    is_request: boolean;
    song: Song;
}

export interface Song {
    id: string;
    text: string;
    artist: string;
    title: string;
    album: string;
    genre: string;
    isrc: string | null;
    lyrics: string | null;
    art: string;
    custom_fields: Record<string, unknown>;
}

export interface StationSchedule {
    id: number;
    start_timestamp: number;
    end_timestamp: number;
    is_dj: boolean;
    name: string;
    description: string | null;
    url: string | null;
}

export interface StatItem {
    icon: React.ComponentType<{ className?: string }>;
    value: number;
    label: string;
    color: string;
    bg: string;
}
