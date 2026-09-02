# models_store/

Place your trained `.pt` model files here.

| Filename                  | Key in settings   |
|---------------------------|-------------------|
| `fire_detection.pt`       | `fire`            |
| `fight_detection.pt`      | `fight`           |
| `weapon_detection.pt`     | `weapon`          |

To add a 4th model, drop the `.pt` file here and add an entry to
`config/settings.py → MODEL_PATHS`.
