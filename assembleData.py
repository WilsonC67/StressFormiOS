import csv
import json
from pathlib import Path


SCREEN_TIME_KEYS = [
    "creativity",
    "education",
    "entertainment",
    "games",
    "informationReading",
    "other",
    "productivityFinance",
    "shoppingFood",
    "social",
    "system",
    "travel",
    "utilities",
]


def prompt_for_path(prompt_text: str, must_exist: bool = True, is_dir: bool = True) -> Path:
    while True:
        raw = input(prompt_text).strip()

        # Handle drag-and-drop paths that may be quoted
        if (raw.startswith('"') and raw.endswith('"')) or (raw.startswith("'") and raw.endswith("'")):
            raw = raw[1:-1]

        path = Path(raw).expanduser()

        if must_exist and not path.exists():
            print("That path does not exist. Try again.")
            continue

        if is_dir and path.exists() and not path.is_dir():
            print("That path is not a directory. Try again.")
            continue

        return path


def build_daily_row(user_id: str, platform: str, payload: dict) -> list[str]:
    mood = payload.get("mood", "")
    anxiety = payload.get("anxiety", "")
    sleep = payload.get("sleep", "")
    timestamp = payload.get("timestamp", "")

    screen_time = payload.get("manualScreenTime", {}) or {}
    screen_time_str = ";".join(
        f"{key}:{screen_time.get(key, 0)}" for key in SCREEN_TIME_KEYS
    )

    raw_survey_answers = f"mood:{mood};anxiety:{anxiety};sleep:{sleep}"

    return [
        user_id,
        platform,
        "daily",
        raw_survey_answers,
        screen_time_str,
        "",
        timestamp,
    ]


def build_weekly_row(user_id: str, platform: str, payload: dict) -> list[str]:
    raw_responses = payload.get("rawResponses", [])
    reversed_scores = payload.get("reversedScores", [])
    pss_total_score = payload.get("pssTotalScore", "")
    timestamp = payload.get("timestamp", "")

    raw_survey_answers = f"raw:{raw_responses};rev:{reversed_scores}"

    return [
        user_id,
        platform,
        "weekly",
        raw_survey_answers,
        "",
        pss_total_score,
        timestamp,
    ]


def parse_json_file(file_path: Path) -> dict | None:
    try:
        with file_path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Skipping {file_path}: failed to parse JSON ({e})")
        return None


def collect_rows(data_folder: Path) -> list[list[str]]:
    rows = []

    for platform_dir_name in ("ios", "android"):
        platform_dir = data_folder / platform_dir_name
        if not platform_dir.exists() or not platform_dir.is_dir():
            print(f"Warning: missing platform directory: {platform_dir}")
            continue

        platform_label = "iOS" if platform_dir_name == "ios" else "Android"

        for user_dir in platform_dir.iterdir():
            if not user_dir.is_dir():
                continue

            user_id = user_dir.name

            for file_path in user_dir.iterdir():
                if not file_path.is_file():
                    continue

                file_name_lower = file_path.name.lower()

                if not (file_name_lower.startswith("daily") or file_name_lower.startswith("weekly")):
                    continue

                payload = parse_json_file(file_path)
                if payload is None:
                    continue

                survey_type = payload.get("type", "").lower()

                if survey_type == "daily" or file_name_lower.startswith("daily"):
                    rows.append(build_daily_row(user_id, platform_label, payload))
                elif survey_type == "weekly" or file_name_lower.startswith("weekly"):
                    rows.append(build_weekly_row(user_id, platform_label, payload))
                else:
                    print(f"Skipping {file_path}: unknown survey type")

    rows.sort(key=lambda row: row[6])  # sort by Timestamp
    return rows


def write_csv(output_path: Path, rows: list[list[str]]) -> None:
    header = [
        "User_ID",
        "Platform",
        "Survey_Type",
        "Raw_Survey_Answers",
        "Screen_Time",
        "PSS_Score",
        "Timestamp",
    ]

    with output_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)


def main() -> None:
    print("Drag in the data folder, then press Enter.")
    data_folder = prompt_for_path("Data folder: ", must_exist=True, is_dir=True)

    print("Drag in the output directory, then press Enter.")
    output_dir = prompt_for_path("Output directory: ", must_exist=True, is_dir=True)

    rows = collect_rows(data_folder)

    output_path = output_dir / "data.csv"
    write_csv(output_path, rows)

    print(f"\nDone. Wrote {len(rows)} rows to:")
    print(output_path)


if __name__ == "__main__":
    main()