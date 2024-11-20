from PyQt6.QtWidgets import ( 
    QLabel, 
    QVBoxLayout, 
    QWidget
)
from PyQt6.QtCore import Qt


# Class KnowledgeWidget inherits from the Qt Widget
class KnowledgeWidget(QWidget):
    def __init__(self):
        super().__init__()

        # Make layout
        layout = QVBoxLayout()
        
        # Make text
        self.titleLabel = QLabel("Here is our knowledge base!")
        self.titleLabel.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter) 
        # Note: we need to use the OR pipe to combine two alignment flags
        
        layout.addWidget(self.titleLabel)
        self.setLayout(layout)
