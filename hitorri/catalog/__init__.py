from .boutique import BOUTIQUE_ITEMS
from .quests import DEEP_QUESTS
from .quotes import EMPATHETIC_QUOTES
from .rituals import BIRTHDAY_TASKS, DEFAULT_TASKS


def get_catalog():
    return {
        "DEFAULT_TASKS": DEFAULT_TASKS,
        "BIRTHDAY_TASKS": BIRTHDAY_TASKS,
        "DEEP_QUESTS": DEEP_QUESTS,
        "BOUTIQUE_ITEMS": BOUTIQUE_ITEMS,
        "EMPATHETIC_QUOTES": EMPATHETIC_QUOTES,
    }
