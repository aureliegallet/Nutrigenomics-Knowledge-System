from PyQt6.QtWidgets import ( 
    QLabel, 
    QVBoxLayout, 
    QWidget
)
from PyQt6.QtCore import Qt


# Class ExpertWidget inherits from the Qt Widget
class ExpertWidget(QWidget):
    def __init__(self):
        super().__init__()

        # Make layout
        layout = QVBoxLayout()
        
        # Make text
        self.titleLabel = QLabel("About our expert")
        self.titleLabel.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter) 
        # Note: we need to use the OR pipe to combine two alignment flags

        layout.addWidget(self.titleLabel)
        
        infoText = [
            """Michael Muller is Professor Emeritus of Nutrigenomics and Systems Nutrition 
            at Norwich Medical School, University of East Anglia. Muller has been a professor 
            for roughly 25 years. Muller's work has generally been on the molecular mechanisms
            by which nutrients and bioactive food components affect health."""
        ]
        for text in infoText:
            self.mainLabel = QLabel(text)
            self.mainLabel.setWordWrap(True)
            self.mainLabel.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter) 
            layout.addWidget(self.mainLabel)

        self.setLayout(layout)



    